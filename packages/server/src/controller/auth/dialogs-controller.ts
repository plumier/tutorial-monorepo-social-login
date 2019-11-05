import Token from "csrf"
import { Context } from "koa"
import { authorize, bind, response } from "plumier"
import qs from "querystring"

import { CSRF_SECRET } from "./auth-controller"

//this controller provide social media auth endpoint that will be opened by a browser dialog

@authorize.public()
export class DialogsController {
    
    //GET /auth/dialogs/facebook
    facebook(@bind.ctx() ctx: Context) {
        return response.redirect("https://www.facebook.com/v4.0/dialog/oauth?" + qs.stringify({
            redirect_uri: ctx.origin + "/auth/facebook",
            client_id: process.env.FACEBOOK_CLIENT_ID,
            display: "popup",
            state: new Token().create(CSRF_SECRET)
        }))
    }

    //GET /auth/dialogs/google
    google(@bind.ctx() ctx: Context) {
        return response.redirect("https://accounts.google.com/o/oauth2/v2/auth?" + qs.stringify({
            access_type: "offline",
            include_granted_scopes: true,
            state: new Token().create(CSRF_SECRET),
            redirect_uri: ctx.origin + "/auth/google",
            response_type: "code",
            client_id: process.env.GOOGLE_CLIENT_ID,
            scope: "https://www.googleapis.com/auth/userinfo.profile"
        }))
    }

    //GET /auth/dialogs/github
    github(@bind.ctx() ctx: Context) {
        return response.redirect("https://github.com/login/oauth/authorize?" + qs.stringify({
            state: new Token().create(CSRF_SECRET),
            redirect_uri: ctx.origin + "/auth/github",
            client_id: process.env.GITHUB_CLIENT_ID,
        }))
    }
}