import React from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"

import Home from "./page/HomePage"
import Login from "./page/LoginPage"
import Axios from "axios"
import session from "./page/session"

// Social login popup handler 
declare global {
  interface Window {
    onLogin(msg: any): void
  }
}
window.onLogin = onLogin
async function onLogin(params: { type: "Success" | "Failed", accessToken: string }) {
  //exchange access token from social login popup with cookie
  if (params.accessToken)
    await Axios.post("/auth/exchange", {}, { headers: { Authorization: `Bearer ${params.accessToken}` } })
      .then(x => {
        session.save()
        window.location.replace("/")
      })
}


export default function App() {
  return <Router>
    <Switch>
      <Route exact path="/" render={() => session.isAuthenticated() ? <Home /> : <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
    </Switch>
  </Router>
} 