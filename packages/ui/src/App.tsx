import "./style/App.css"

import React from "react"
import { BrowserRouter as Router, Redirect, Route, Switch } from "react-router-dom"

import { LoginUserContext } from "./context"
import { useStorage } from "./helper"
import Header from "./page/Header"
import Home from "./page/HomePage"
import Login from "./page/LoginPage"
import Register from "./page/Register"

export default function App() {
  const [login, setLogin] = useStorage("isLogin", false)

  return <LoginUserContext.Provider value={[login, setLogin]} >
    <Header/>
    <div className="container">

      <Router>
        <Switch>
          <Route exact path="/" render={() => login ? <Home /> : <Redirect to="/login" />} />
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="*">
            <h1 className="text-404">Error 404 - The page you're looking for doesn't exists</h1>
          </Route>
        </Switch>
      </Router>
    </div>
  </LoginUserContext.Provider>
} 