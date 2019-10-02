import { MongoMemoryServer } from "mongodb-memory-server-global"
import { createApp } from "../src/app"
import { AuthController } from "../src/controller/auth-controller";
import { FacebookLoginStatus, FacebookProfile } from "@plumier/social-login";
import Mongoose from "mongoose";
import { UserModel, SocialLoginModel, SocialLogin, User, LoginUser } from "../src/model/model";
import stub from "./helper/stub";
import { verify } from "jsonwebtoken";
import { ActionResult } from "plumier";

function getLoginUserFromCallback(result: ActionResult) {
    const reg = result.body.match(/"accessToken":"(.*)"/)[1]
    return verify(reg, process.env.JWT_SECRET) as LoginUser
}

describe("Social Login", () => {
    let mongo: MongoMemoryServer;

    beforeEach(async () => {
        //use in-memory mongodb server for data isolation
        mongo = new MongoMemoryServer()
        const uri = await mongo.getConnectionString()
        //createApp called to trigger mongoose model generator
        await createApp({ mongoDbUri: uri, mode: "production" })
    })

    afterEach(async () => {
        await Mongoose.disconnect()
        await mongo.stop()
    })

    it("Should able to login", async () => {
        const social = await stub.socialLogin.db()
        await stub.user.db({ socialLogin: [social._id] })
        const controller = new AuthController()
        const result = await controller.facebook(stub.facebook({ id: social.socialId }))
        const login = getLoginUserFromCallback(result)
        const user = await stub.user.get({ socialLogin: social._id })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })

    it("Should able to register and login", async () => {
        const controller = new AuthController()
        const result = await controller.facebook(stub.facebook({ id: "12345678" }))
        const login = getLoginUserFromCallback(result)
        const socialLogin = await stub.socialLogin.get({ socialId: "12345678" })
        const user = await stub.user.get({ socialLogin: socialLogin!.id })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })
})