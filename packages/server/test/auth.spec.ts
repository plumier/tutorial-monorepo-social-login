import { MongoMemoryServer } from "mongodb-memory-server-global"
import { createApp } from "../src/app"
import { AuthController } from "../src/controller/auth-controller";
import { FacebookLoginStatus, FacebookProfile } from "@plumier/social-login";
import Mongoose from "mongoose";
import { UserModel } from "../src/model/model";


describe("Social Login", () => {
    let mongo: MongoMemoryServer;

    beforeEach(async () => {
        mongo = new MongoMemoryServer()
        const uri = await mongo.getConnectionString()
        //createApp called to trigger mongoose model generator
        await createApp({ mongoDbUri: uri, mode: "production" })
    })

    afterEach(async () => {
        await Mongoose.disconnect()
        await mongo.stop()
    })

    it("Non registered user should able to login", async () => {
        const controller = new AuthController()
        const profile = { id: "12345678", name: "John Doe", picture: { data: { url: "https://google.com/image.jpg" } } } as FacebookProfile
        const result = await controller.loginOrRegister(new FacebookLoginStatus("Success", undefined, profile), "Facebook", x => {
            return ["12345678", { name: x.name, picture: x.picture.data.url }]
        })
        // const user = await UserModel.findOne({"socialLogin.socialId": "12345678"})
        // expect(user!.toObject()).toMatchObject({})
        expect(result.body.replace(/"accessToken":(\".*\")/, "")).toMatchSnapshot()

    })
})