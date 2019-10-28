import qs from "querystring"

function popup(url: string, w = 600, h = 500) {
    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
    return window.open(url, "Social Login", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
}

export function facebook() {
    return popup("https://www.facebook.com/v4.0/dialog/oauth?" + qs.stringify({
        redirect_uri: window.location.origin + "/auth/facebook",
        client_id: "2287967521513920",
        display: "popup",
        state: "state"
    }))
}

export function google() {
    return popup("https://accounts.google.com/o/oauth2/v2/auth?" + qs.stringify({
        access_type: "offline",
        include_granted_scopes: true,
        state: "state",
        redirect_uri: window.location.origin + "/auth/google",
        response_type: "code",
        client_id: "719947453081-72facf1p5mlfk1jm585v4f7n13nafuci.apps.googleusercontent.com",
        scope: "https://www.googleapis.com/auth/userinfo.profile"
    }))
}

export function github() {
    return popup("https://github.com/login/oauth/authorize?" + qs.stringify({
        state: "state",
        redirect_uri: window.location.origin + "/auth/github",
        client_id: "83ed72751507695cdf0f",
    }))
}