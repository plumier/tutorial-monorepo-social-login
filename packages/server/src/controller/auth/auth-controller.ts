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
import Token from "csrf"
import { sign } from "jsonwebtoken"
import { Document } from "mongoose"
import { ActionResult, authorize, bind, HttpStatusError, response, route, val } from "plumier"

import { LoginUser, User, UserModel } from "../../model/model"

export function signToken(user: User & Document) {
    return sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
}

//save global CSRF secret in memory
export const CSRF_SECRET = new Token().secretSync()

@route.root("/auth")
@authorize.public()
export class AuthController {

    //POST /auth/login
    @route.post()
    async login(@val.email() email: string, password: string) {
        const user = await UserModel.findOne({ email })
        if (user && await bcrypt.compare(password, user.password)) {
            const token = signToken(user)
            return new ActionResult({ accessToken: token })
                .setCookie("Authorization", token)
        }
        else throw new HttpStatusError(422, "Invalid username or password")
    }

    //GET /auth/logout
    async logout() {
        return new ActionResult()
            .setCookie("Authorization")
    }

    @route.ignore()
    private async loginOrRegister(status: "Success" | "Failed", state: string, user: Partial<User>) {
        //verify the CSRF token stored in state parameter (see SocialDialogController)
        if (!new Token().verify(CSRF_SECRET, state))
            return response.callbackView({ status: "Failed", message: "Invalid CSRF token" })
        //if login process (done by the callback) successful, proceed generate the JWT token
        if (status === "Success") {
            const savedUser = await UserModel.findOne({ provider: user.provider, socialId: user.socialId })
            let accessToken
            if (savedUser) {
                accessToken = signToken(savedUser)
            }
            else {
                const newUser = await new UserModel(<User>{ ...user!, role: "User" }).save()
                accessToken = signToken(newUser)
            }
            return response.callbackView({ status, accessToken })
                .setCookie("Authorization", accessToken)
        }
        else
            return response.callbackView({ status })
    }

    //GET /auth/facebook
    @oAuthCallback(new FacebookProvider(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_SECRET))
    async facebook(@bind.loginStatus() login: FacebookLoginStatus, state: string) {
        const data = login.data || {} as FacebookProfile
        return this.loginOrRegister(login.status, state, { name: data.name, picture: data.picture.data.url, provider: "Facebook", socialId: data.id })
    }

    //GET /auth/google
    @oAuthCallback(new GoogleProvider(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET))
    async google(@bind.loginStatus() login: GoogleLoginStatus, state: string) {
        const data = login.data || {} as GoogleProfile
        return this.loginOrRegister(login.status, state, { name: data.name, picture: data.picture, provider: "Google", socialId: data.id })
    }

    //GET /auth/github
    @oAuthCallback(new GitHubProvider(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_SECRET))
    async github(@bind.loginStatus() login: GitHubLoginStatus, state: string) {
        const data = login.data || {} as GitHubProfile
        return this.loginOrRegister(login.status, state, { name: data.name, picture: data.url, provider: "Github", socialId: data.id.toString() })
    }
}