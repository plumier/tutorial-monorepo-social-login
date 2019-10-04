import "../style/Login.css"
import React from "react"
import { Link } from "react-router-dom"

function Login(){
    function Login(){

    }
    return(
        <div className="container">
            <div className="center-container">
                <div className="form-container">
                    <h2>Login to To-Do</h2>
                    <input className="input-form" type="text" placeholder="E-mail"/><br/>
                    <input className="input-form" type="password" placeholder="Password"/><br/>
                    <Link to="/home"><button className="login">Login</button></Link><br/>
                    <button className="login-google">
                        Login with
                        <span className="text-google">
                            <span className="blue"> G</span>
                            <span className="red">o</span>
                            <span className="yellow">o</span>
                            <span className="blue">g</span>
                            <span className="green">l</span>
                            <span className="red">e</span>
                        </span>
                    </button><br/>
                    <button className="login-social">Login with <span className="text-facebook">Facebook</span></button><br/>
                    <button className="login-social">Login with <span className="text-github">Github</span></button><br/>
                </div>
            </div>
        </div>
    )
}
export default Login;