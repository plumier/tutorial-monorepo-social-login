import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { EventHandler, FormEventHandler, useEffect, useState } from "react"
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
    dialog("/auth/dialogs/facebook")
  }

  const googleDialog = () => {
    dialog("/auth/dialogs/google")
  }

  const githubDialog = () => {
    dialog("/auth/dialogs/github")
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
      <p className="register">Not a member? click <a href="/register">here</a> to register</p>
    </form>
  </div>
}