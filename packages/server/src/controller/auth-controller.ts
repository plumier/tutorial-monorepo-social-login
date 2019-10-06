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
import { bind, response, route, authorize, HttpStatusError, val } from "plumier"
import bcrypt from "bcrypt"

import { LoginUser, SocialLogin, SocialLoginModel, User, UserModel } from "../model/model"

type Provider = "Github" | "Facebook" | "Google"

export class AuthController {
    
    @authorize.public()
    @route.post()
    async login(@val.email() email: string, password: string) {
        const user = await UserModel.findOne({ email })
        if (user && await bcrypt.compare(password,user.password)) {
            const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
            return { token }
        }
        else throw new HttpStatusError(422, "Invalid username or password")
    }

    @authorize.public()
    @route.post()
    async register(name:string,@val.email()email: string,password: string){
        
        const encryptedPassword= await bcrypt.hash(password,10)
        let usr=new User(name,email,"","",encryptedPassword,"User",[])
        let user= await UserModel.create(usr)
        const token = sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
        return {token}
    }

    @route.ignore()
    async loginOrRegister<T>(login: SocialLoginStatus<T>, provider: Provider, transform: (data: T) => [string, Partial<User>]) {
        if (login.status === "Success") {
            const [socialId, user] = transform(login.data!)
            const savedUser = await UserModel.findOne({
                "socialLogin.provider": provider,
                "socialLogin.socialId": socialId
            })
            let accessToken
            if (savedUser) {
                accessToken = sign(<LoginUser>{ userId: savedUser.id, role: savedUser.role }, process.env.JWT_SECRET)
            }
            else {
                const socialLogin = await new SocialLoginModel(<SocialLogin>{ socialId, provider }).save()
                const newUser = await new UserModel(<User>{ ...user!, role: "User", socialLogin: [socialLogin._id] }).save()
                await newUser.save()
                accessToken = sign(<LoginUser>{ userId: newUser.id, role: newUser.role }, process.env.JWT_SECRET)
            }
            return response.callbackView({ status: login.status, accessToken })
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