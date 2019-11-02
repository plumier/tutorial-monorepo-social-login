import { Context } from "koa"
import { bind, response } from "plumier"
import qs from "querystring"

import { csrfToken } from "./helper"


export class DialogsController {
    facebook(@bind.ctx() ctx: Context) {
        return response.redirect("https://www.facebook.com/v4.0/dialog/oauth?" + qs.stringify({
            redirect_uri: ctx.origin + "/auth/facebook",
            client_id: process.env.FACEBOOK_CLIENT_ID,
            display: "popup",
            state: csrfToken()
        }))
    }

    google(@bind.ctx() ctx: Context) {
        return response.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + qs.stringify({
            access_type: "offline",
            include_granted_scopes: true,
            state: csrfToken(),
            redirect_uri: ctx.origin + "/auth/google",
            response_type: "code",
            client_id: process.env.GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/userinfo.profile"
        }))
    }

    github(@bind.ctx() ctx: Context) {
        return response.redirect("https://github.com/login/oauth/authorize?" + qs.stringify({
            state: csrfToken(),
            redirect_uri: ctx.origin + "/auth/github",
            client_id: process.env.GITHUB_CLIENT_ID,
        }))
    }
}