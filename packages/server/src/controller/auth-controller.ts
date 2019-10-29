import {
    FacebookLoginStatus,
    FacebookProvider,
    GitHubLoginStatus,
    GitHubProvider,
    GoogleLoginStatus,
    GoogleProvider,
    oAuthCallback,
    SocialLoginStatus,
} from "@plumier/social-login"
import { sign } from "jsonwebtoken"
import { bind, response, route, authorize, HttpStatusError, val, ActionResult } from "plumier"
import bcrypt from "bcrypt"

import { LoginUser, SocialLogin, SocialLoginModel, User, UserModel, UserRole } from "../model/model"

type Provider = "Github" | "Facebook" | "Google"

function createAuthCookie(token: string) {
    return `Authorization=${token}; HttpOnly; SameSite=Strict; Path=/`
}

@authorize.public()
export class AuthController {

    // this endpoint used to exchange token with cookie
    // usually used by social login
    @route.post()
    async exchange(@bind.user() user: LoginUser) {
        const token = sign(<LoginUser>{ userId: user.userId, role: user.role }, process.env.JWT_SECRET)
        return new ActionResult({ accessToken: token })
            .setHeader("set-cookie", createAuthCookie(token))
    }

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
    private async loginOrRegister<T>(login: SocialLoginStatus<T>, provider: Provider, transform: (data: T) => [string, Partial<User>]) {
        if (login.status === "Success") {
            const [socialId, user] = transform(login.data!)
            const socialLogin = await SocialLoginModel.findOne({ provider: provider, socialId: socialId })
            const savedUser = socialLogin && await UserModel.findOne({ socialLogin: socialLogin.id })
            let accessToken
            if (savedUser) {
                accessToken = sign(<LoginUser>{ userId: savedUser.id, role: savedUser.role }, process.env.JWT_SECRET)
            }
            else {
                const socialLogin = await new SocialLoginModel(<SocialLogin>{ socialId, provider }).save()
                const newUser = await new UserModel(<User>{ ...user!, role: "User", socialLogin: [socialLogin._id] }).save()
                accessToken = sign(<LoginUser>{ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET)
            }
            return response.callbackView({ status: login.status, accessToken })
                .setHeader("set-cookie", createAuthCookie(accessToken))
        }
        else
            return response.callbackView({ status: login.status })
    }

    @oAuthCallback(new FacebookProvider(process.env.FACEBOOK_CLIENT_ID, process.env.FACEBOOK_SECRET))
    async facebook(@bind.loginStatus() login: FacebookLoginStatus) {
        return this.loginOrRegister(login, "Facebook", x => {
            return [x.id, { name: x.name, picture: x.picture.data.url }]
        })
    }

    @oAuthCallback(new GoogleProvider(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_SECRET))
    async google(@bind.loginStatus() login: GoogleLoginStatus) {
        return this.loginOrRegister(login, "Google", x => {
            return [x.id, { name: x.name, picture: x.picture }]
        })
    }

    @oAuthCallback(new GitHubProvider(process.env.GITHUB_CLIENT_ID, process.env.GITHUB_SECRET))
    async github(@bind.loginStatus() login: GitHubLoginStatus) {
        return this.loginOrRegister(login, "Github", x => {
            return [x.id.toString(), { name: x.name, picture: x.url }]
        })
    }
}