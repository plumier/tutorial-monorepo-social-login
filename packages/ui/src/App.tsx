import React from "react"
import { BrowserRouter as Router, Route } from "react-router-dom"

import Home from "./page/HomePage"
import Login from "./page/LoginPage"



function PrivateHomeRoute(){
  return (<Route/>)
}


export function App() {
  return <Router>
    <Route exact path="/login" component={Login} />
    <PrivateHomeRoute/>
  </Router>
} 