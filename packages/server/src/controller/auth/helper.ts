import Token from "csrf"
import { sign } from "jsonwebtoken"
import { Document } from "mongoose"

import { LoginUser, User } from "../../model/model"


//create cookie to store JWT token
//HttpOnly will prevent any JavaScript access the token (prevent XSS)
//SameSite will prevent any request / form to send the token outside the site (prevent CSRF)
export function createAuthCookie(token: string) {
    return `Authorization=${token}; HttpOnly; SameSite=Strict; Path=/`
}

export function signToken(user: User & Document) {
    return sign(<LoginUser>{ userId: user.id, role: user.role }, process.env.JWT_SECRET)
}

//save global CSRF secret in memory
const CSRF_SECRET = new Token().secretSync()

export function csrfToken() {
    return new Token().create(CSRF_SECRET)
}

export function csrfVerify(token: string) {
    return new Token().verify(CSRF_SECRET, token)
}