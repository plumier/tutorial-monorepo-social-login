import { verify } from "jsonwebtoken"
import { ActionResult } from "plumier"

import { SocialLoginController } from "../src/controller/auth-controller"
import { LoginUser } from "../src/model/model"
import { appStub, AppStub } from "./helper/stub.app"
import stub from "./helper/stub"

function getLoginUserFromCallback(result: ActionResult) {
    const reg = result.body.match(/"accessToken":"(.*)"/)[1]
    return verify(reg, process.env.JWT_SECRET) as LoginUser
}

describe("Social Login", () => {
    let harness:AppStub
    beforeEach(async () => harness = await appStub())
    afterEach(async () => await harness.stop())


    it("Should able to login", async () => {
        const social = await stub.socialLogin.db()
        await stub.user.db({ socialLogin: [social._id], role: "User" })
        const controller = new SocialLoginController()
        const result = await controller.facebook(stub.facebook({ id: social.socialId }))
        const login = getLoginUserFromCallback(result)
        const user = await stub.user.get({ socialLogin: social._id })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })

    it("Should able to register and login", async () => {
        const controller = new SocialLoginController()
        const result = await controller.facebook(stub.facebook({ id: "12345678" }))
        const login = getLoginUserFromCallback(result)
        const socialLogin = await stub.socialLogin.get({ socialId: "12345678" })
        const user = await stub.user.get({ socialLogin: socialLogin!.id })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })
})