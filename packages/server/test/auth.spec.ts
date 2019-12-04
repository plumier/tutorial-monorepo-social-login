import { verify } from "jsonwebtoken"
import { ActionResult } from "plumier"

import { AuthController } from "../src/controller/auth/auth-controller"
import { LoginUser } from "../src/model"
import stub from "./helper/stub"
import { AppStub, appStub } from "./helper/stub.app"
import Token from "csrf"

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
        const controller = new AuthController()
        const secret = new Token().secretSync()
        const result = await controller.facebook(stub.facebook({ id: user.socialId }), new Token().create(secret), secret)
        const login = getLoginUserFromCallback(result)
        const savedUser = await stub.user.get({ provider: "Facebook", socialId: user.socialId })
        expect(savedUser!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })

    it("Should able to register and login", async () => {
        const controller = new AuthController()
        const secret = new Token().secretSync()
        const result = await controller.facebook(stub.facebook({ id: "12345678" }), new Token().create(secret), secret)
        const login = getLoginUserFromCallback(result)
        const user = await stub.user.get({ provider: "Facebook", socialId: "12345678" })
        expect(user!.toObject()).toMatchObject({ id: login.userId, role: login.role })
    })
})