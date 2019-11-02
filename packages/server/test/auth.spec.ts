import { verify } from "jsonwebtoken"
import { ActionResult } from "plumier"

import { csrfToken } from "../src/controller/auth/helper"
import { SocialLoginController } from "../src/controller/auth/social-login-controller"
import { LoginUser } from "../src/model/model"
import stub from "./helper/stub"
import { AppStub, appStub } from "./helper/stub.app"

function getLoginUserFromCallback(result: ActionResult) {
    const reg = result.body.match(/"accessToken":"(.*)"/)[1]
    return verify(reg, process.env.JWT_SECRET) as LoginUser
}

describe("Social Login", () => {
    let harness: AppStub
    beforeEach(async () => harness = await appStub())
    afterEach(async () => await harness.stop())


    it("Should able to login", async () => {
        const user = await stub.user.db({ provider: "Facebook", role: "User" })
        const controller = new SocialLoginController()
        const result = await controller.facebook(stub.facebook({ id: user.socialId }), csrfToken())
        const login = getLoginUserFromCallback(result)
        const savedUser = await stub.user.get({ provider: "Facebook", socialId: user.socialId })
        expect(savedUser!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })

    it("Should able to register and login", async () => {
        const controller = new SocialLoginController()
        const result = await controller.facebook(stub.facebook({ id: "12345678" }), csrfToken())
        const login = getLoginUserFromCallback(result)
        const user = await stub.user.get({ provider: "Facebook", socialId: "12345678" })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })
})