import {
    FacebookLoginStatus,
    FacebookProfile,
    FacebookProvider,
    GitHubLoginStatus,
    GitHubProfile,
    GitHubProvider,
    GoogleLoginStatus,
    GoogleProfile,
    GoogleProvider,
    oAuthCallback,
} from "@plumier/social-login"
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"
import { ActionResult, authorize, bind, HttpStatusError, response, route, val } from "plumier"

import { LoginUser, User, UserModel } from "../model/model"


type Provider = "Github" | "Facebook" | "Google"

function createAuthCookie(token: string) {
    return `Authorization=${token}; HttpOnly; SameSite=Strict; Path=/`
}

@authorize.public()
export class AuthController {
    @route.post()
    async login(@val.email() email: string, password: string) {
        const user = await UserModel.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
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


@route.root("/auth")
@authorize.public()
export class SocialLoginController {
    @route.ignore()
    private async loginOrRegister(status: "Success" | "Failed", provider: Provider, socialId: string, user: Partial<User>) {
        if (status === "Success") {
            const savedUser = await UserModel.findOne({ provider, socialId })
            let accessToken
            if (savedUser) {
                accessToken = sign(<LoginUser>{ userId: savedUser.id, role: savedUser.role }, process.env.JWT_SECRET)
            }
            else {
                const newUser = await new UserModel(<User>{ ...user!, role: "User", provider, socialId }).save()
                accessToken = sign(<LoginUser>{ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET)
            }
            return response.callbackView({ status, accessToken })
                .setHeader("set-cookie", createAuthCookie(accessToken))
        }
        else
            return response.callbackView({ status })
    }

    @oAuthCallback(new FacebookProvider(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_SECRET))
    async facebook(@bind.loginStatus() login: FacebookLoginStatus) {
        const data = login.data || {} as FacebookProfile
        return this.loginOrRegister(login.status, "Facebook", data.id, { name: data.name, picture: data.picture.data.url })
    }

    @oAuthCallback(new GoogleProvider(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET))
    async google(@bind.loginStatus() login: GoogleLoginStatus) {
        const data = login.data || {} as GoogleProfile
        return this.loginOrRegister(login.status, "Google", data.id, { name: data.name, picture: data.picture })
    }

    @oAuthCallback(new GitHubProvider(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_SECRET))
    async github(@bind.loginStatus() login: GitHubLoginStatus) {
        const data = login.data || {} as GitHubProfile
        return this.loginOrRegister(login.status, "Github", data.id.toString(), { name: data.name, picture: data.url })
    }
}