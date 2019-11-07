import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { FormEventHandler, useState, useEffect } from "react"
import { useHistory } from "react-router"

import session from "./session"
import { Link } from "react-router-dom"

// Social login popup handler 
(window as any).onLogin = (sender: Window, params: { status: "Success" | "Failed", accessToken: string }) => {
  sender.close()
  //make sure the sender dialog is in the same origin with the app
  if (sender.location.origin === window.location.origin && params.status === "Success") {
    session.save()
    window.location.replace("/")
  }
}

export default function Login() {
  const history = useHistory()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | undefined>()

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    e.preventDefault()
    setLoading(true)
    Axios.post("/auth/login", new FormData(e.currentTarget))
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
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() =>{
    setLoading(true)
    Axios.get("/auth/dialogs/identity")
      .then(() => setLoading(false))
      .catch(console.error)
  }, [])

  const dialog = (url: string, w = 600, h = 500) => {
    const y = window.top.outerHeight / 2 + window.top.screenY - (h / 2);
    const x = window.top.outerWidth / 2 + window.top.screenX - (w / 2);
    window.open(url, "Social Login", 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=' + w + ', height=' + h + ', top=' + y + ', left=' + x);
  }

  const facebookDialog = async () => {
    dialog("/auth/dialogs/facebook")
  }

  const googleDialog = async () => {
    dialog("/auth/dialogs/google")
  }

  const githubDialog = async () => {
    dialog("/auth/dialogs/github")
  }

  return <div className="login-container">
    <form onSubmit={onSubmit}>
      <input name="email" type="text" placeholder="Email" />
      <input name="password" type="password" placeholder="Password" />
      {!!error ? (<div className="error">{error}</div>) : ""}
      <button disabled={loading} type="submit">Login</button>
    </form>
    <div className="social-login">
      <button disabled={loading} onClick={googleDialog}><span className="link-button icon-google"></span></button>
      <button disabled={loading} onClick={facebookDialog}><span className="link-button icon-facebook-official"></span></button>
      <button disabled={loading} onClick={githubDialog}><span className="link-button icon-github"></span></button>
    </div>
    <p className="register">Not a member? click <Link to="/register">here</Link> to register</p>
  </div>
}