import React, { Children, useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Redirect, useHistory, Switch } from "react-router-dom"

import Home from "./page/HomePage"
import Login from "./page/LoginPage"
import Axios from "axios"


export default function App() {
  
  const [isAuthorize, authorize] = useState(false)
  useEffect(() => {
    Axios.get("/api/v1/users/me")
      .then(x => {
        authorize(true)
        //history.push("/home")
      })
      .catch(e => {
        authorize(false)
      })
  }, [])

  return <Router>
    <Switch>
      <Route exact path="/login" component={Login} />
      <Route path="/" render={() => isAuthorize ? <Home /> : <Redirect to="/login" />} />
    </Switch>
  </Router>
} 