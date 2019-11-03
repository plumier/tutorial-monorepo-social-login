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
import { authorize, bind, response, route } from "plumier"

import { User, UserModel } from "../../model/model"
import { createAuthCookie, csrfVerify, signToken } from "./helper"

type Provider = "Github" | "Facebook" | "Google"


@route.root("/auth")
@authorize.public()
export class SocialLoginController {
    @route.ignore()
    private async loginOrRegister(status: "Success" | "Failed", provider: Provider, socialId: string, user: Partial<User>, state: string) {
        //verify the CSRF token stored in state parameter (see SocialDialogController)
        if (!csrfVerify(state)) return response.callbackView({ status: "Failed", message: "Invalid CSRF token" })
        //if login process (done by the callback) successful, proceed generate the JWT token
        if (status === "Success") {
            const savedUser = await UserModel.findOne({ provider, socialId })
            let accessToken
            if (savedUser) {
                accessToken = signToken(savedUser)
            }
            else {
                const newUser = await new UserModel(<User>{ ...user!, role: "User", provider, socialId }).save()
                accessToken = signToken(newUser)
            }
            return response.callbackView({ status, accessToken })
                .setHeader("set-cookie", createAuthCookie(accessToken))
        }
        else
            return response.callbackView({ status })
    }

    @oAuthCallback(new FacebookProvider(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_SECRET))
    async facebook(@bind.loginStatus() login: FacebookLoginStatus, state: string) {
        const data = login.data || {} as FacebookProfile
        return this.loginOrRegister(login.status, "Facebook", data.id, { name: data.name, picture: data.picture.data.url }, state)
    }

    @oAuthCallback(new GoogleProvider(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET))
    async google(@bind.loginStatus() login: GoogleLoginStatus, state: string) {
        const data = login.data || {} as GoogleProfile
        return this.loginOrRegister(login.status, "Google", data.id, { name: data.name, picture: data.picture }, state)
    }

    @oAuthCallback(new GitHubProvider(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_SECRET))
    async github(@bind.loginStatus() login: GitHubLoginStatus, state: string) {
        const data = login.data || {} as GitHubProfile
        return this.loginOrRegister(login.status, "Github", data.id.toString(), { name: data.name, picture: data.url }, state)
    }
}
