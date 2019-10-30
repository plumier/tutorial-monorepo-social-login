import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import qs from "querystring"
import React, { FormEventHandler, useState, useEffect, EventHandler } from "react"
import { useHistory } from "react-router"

import session from "./session"

// Social login popup handler 
(window as any).onLogin = (sender: Window, params: { status: "Success" | "Failed", accessToken: string }) => {
  sender.close()
  if (params.status === "Success") {
    session.save()
    window.location.replace("/")
  }
}

export default function Login() {
  const history = useHistory()
  const [error, setError] = useState<string | undefined>()

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    Axios.post("/auth/login", data)
      .then(x => {
        setError(undefined)
        session.save()
        history.replace("/")
      })
      .catch((e: AxiosError) => {
        if (!e.response) return console.log(e)
        if (e.response.status === 422)
          return setError("Invalid email or password")
        console.log(e)
      })
  }

  const dialog = (url: string, w = 600, h = 500) => {
    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
    window.open(url, "Social Login", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
  }

  const facebookDialog = () => {
    dialog("https://www.facebook.com/v4.0/dialog/oauth?" + qs.stringify({
      redirect_uri: window.location.origin + "/auth/facebook",
      client_id: "2287967521513920",
      display: "popup",
      state: "state"
    }))
  }

  const googleDialog = () => {
    dialog("https://accounts.google.com/o/oauth2/v2/auth?" + qs.stringify({
      access_type: "offline",
      include_granted_scopes: true,
      state: "state",
      redirect_uri: window.location.origin + "/auth/google",
      response_type: "code",
      client_id: "719947453081-72facf1p5mlfk1jm585v4f7n13nafuci.apps.googleusercontent.com",
      scope: "https://www.googleapis.com/auth/userinfo.profile"
    }))
  }

  const githubDialog = () => {
    dialog("https://github.com/login/oauth/authorize?" + qs.stringify({
      state: "state",
      redirect_uri: window.location.origin + "/auth/github",
      client_id: "83ed72751507695cdf0f",
    }))
  }

  return <div className="login-container">
    <form onSubmit={onSubmit}>
      <input name="email" type="email" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      {!!error ? (<div className="error">{error}</div>) : ""}
      <button type="submit">Login</button>
      <div className="social-login">
        <a href="#" onClick={() => googleDialog()}><span className="icon-google"></span></a>
        <a href="#" onClick={() => facebookDialog()}><span className="icon-facebook-official"></span></a>
        <a href="#" onClick={() => githubDialog()}><span className="icon-github"></span></a>
      </div>
      <p className="register">Not a member? click <a href="#">here</a> to register</p>
    </form>
  </div>
}