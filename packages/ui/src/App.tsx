import React from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"

import Home from "./page/HomePage"
import Login from "./page/LoginPage"
import Register from "./page/Register"
import session from "./page/session"


export default function App() {
  return <Router>
    <Switch>
      <Route exact path="/" render={() => session.isAuthenticated() ? <Home /> : <Redirect to="/login" />} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
    </Switch>
  </Router>
} 