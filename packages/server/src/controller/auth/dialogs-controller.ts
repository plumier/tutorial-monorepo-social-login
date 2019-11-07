import {
    FacebookDialogProvider,
    GitHubDialogProvider,
    GoogleDialogProvider,
    oAuthDialogEndPoint,
} from "@plumier/social-login"
import Tokens from "csrf"
import { authorize, bind, response } from "plumier"

//this controller provide social media auth endpoint that will be opened by a browser dialog
//create CSRF secret token for each session, send the secret to the client cookie as an identity.
//this identity will be used to verify if current user is the authentic user requests the login.

@authorize.public()
export class DialogsController {

    //retrieve the csrf token secret as an identity 
    identity() {
        return response.json({})
            .setCookie("csrf:key", new Tokens().secretSync())
    }

    @oAuthDialogEndPoint(new FacebookDialogProvider("/auth/facebook", process.env.FACEBOOK_CLIENT_ID))
    //GET /auth/dialogs/facebook
    facebook(@bind.cookie("csrf:key") secret: string) {
        return { state: new Tokens().create(secret) }
    }

    @oAuthDialogEndPoint(new GoogleDialogProvider("/auth/google", process.env.GOOGLE_CLIENT_ID))
    //GET /auth/dialogs/google
    google(@bind.cookie("csrf:key") secret: string) {
        return { state: new Tokens().create(secret) }
    }

    @oAuthDialogEndPoint(new GitHubDialogProvider("/auth/github", process.env.GITHUB_CLIENT_ID))
    //GET /auth/dialogs/github
    github(@bind.cookie("csrf:key") secret: string) {
        return { state: new Tokens().create(secret) }
    }
}