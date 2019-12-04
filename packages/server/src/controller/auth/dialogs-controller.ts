import {
    FacebookDialogProvider,
    GitHubDialogProvider,
    GoogleDialogProvider,
    oAuthDialogEndPoint,
} from "@plumier/social-login"
import Tokens from "csrf"
import { authorize, bind, response } from "plumier"

@authorize.public()
export class DialogsController {

    /*
    OAuth CSRF protection 
    There are 3 important parts to note
    1. Send the CSRF Token secret to the client as a cookie, by calling the
       GET /auth/dialogs/identity from the login form
    2. Generate CSRF token using the secret above on each auth dialog endpoint 
       use the `state` parameter on the OAuth URL 
    3. Validate the CSRF token on the OAuth callback url, see auth-controller.ts
    */


    //GET /auth/dialogs/identity
    //retrieve the csrf token secret as an identity 
    identity() {
        return response.json({})
            .setCookie("csrf:key", new Tokens().secretSync())
    }

    /*
    these 3 methods below provide the the OAuth dialog url for each social login provider.
    @oAuthDialogEndPoint will automatically create the login url based on the DialogProvider 
    the automatically redirect the request to the login url.
    */


    //GET /auth/dialogs/facebook
    @oAuthDialogEndPoint(new FacebookDialogProvider("/auth/facebook", process.env.FACEBOOK_CLIENT_ID))
    facebook(@bind.cookie("csrf:key") secret: string) {
        //generate CSRF token based on CSRF secret provided by GET /auth/dialogs/identity
        //pass the token to the state parameter. 
        return { state: new Tokens().create(secret) }
    }

    //GET /auth/dialogs/google
    @oAuthDialogEndPoint(new GoogleDialogProvider("/auth/google", process.env.GOOGLE_CLIENT_ID))
    google(@bind.cookie("csrf:key") secret: string) {
        //generate CSRF token based on CSRF secret provided by GET /auth/dialogs/identity
        return { state: new Tokens().create(secret) }
    }

    //GET /auth/dialogs/github
    @oAuthDialogEndPoint(new GitHubDialogProvider("/auth/github", process.env.GITHUB_CLIENT_ID))
    github(@bind.cookie("csrf:key") secret: string) {
        //generate CSRF token based on CSRF secret provided by GET /auth/dialogs/identity
        return { state: new Tokens().create(secret) }
    }
}

