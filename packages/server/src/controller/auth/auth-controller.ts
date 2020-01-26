import { OAuthUser, redirectUri } from "@plumier/social-login"
import bcrypt from "bcrypt"
import { sign } from "jsonwebtoken"
import { Document } from "mongoose"
import { ActionResult, authorize, bind, HttpStatusError, response, route, val } from "plumier"

import { LoginUser, User, UserModel } from "../../model"

export function signToken(user: User & Document) {
    return sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
}

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
                //Plumier automatically check for JWT if found cookie named "Authorization"
                //by default HttpOnly cookie is true
                .setCookie("Authorization", token, { sameSite: "lax" })
        }
        else throw new HttpStatusError(422, "Invalid username or password")
    }

    //GET /auth/logout
    async logout() {
        return new ActionResult()
            //set cookie without value will automatically clear the cookie
            .setCookie("Authorization")
    }

    @redirectUri()
    async callback(@bind.oAuthUser() { name, profilePicture, provider, id }: OAuthUser) {
        const savedUser = await UserModel.findOne({ provider: provider, socialId: id })
        const newUser = <User>{ name, picture: profilePicture, provider, socialId: id, role: "User" }
        let accessToken = signToken(savedUser ?? await UserModel.create(newUser))
        // send message to main window telling that the login was successful
        return response.postMessage({ status: "Success", accessToken })
            .setCookie("Authorization", accessToken, { sameSite: "lax" })
    }
}