import React from "react"
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Login from "./LoginPage";
import App from "../App";

function StartPage(){
    
    return(
        <Router>
            <div>

            </div>
            <Switch>
                <Route path="/">
                    <Login/>
                </Route>
                <Route path="/login">
                    <Login/>
                </Route>
                <Route path="/home">
                    <App/>
                </Route>
            </Switch>
        </Router>
    )
}
export default StartPage