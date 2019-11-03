import bcrypt from "bcrypt"
import { ActionResult, authorize, HttpStatusError, route, val } from "plumier"

import { UserModel } from "../../model/model"
import { createAuthCookie, signToken } from "./helper"


@route.root("/auth")
@authorize.public()
export class AuthController {
    @route.post()
    async login(@val.email() email: string, password: string) {
        const user = await UserModel.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            const token = signToken(user)
            return new ActionResult({ accessToken: token })
                .setHeader("set-cookie", createAuthCookie(token))
        }
        else throw new HttpStatusError(422, "Invalid username or password")
    }

    async logout() {
        return new ActionResult()
            .setHeader("set-cookie", createAuthCookie(""))
    }
}