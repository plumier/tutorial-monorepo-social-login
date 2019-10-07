import "../style/Login.css"
import React, { useState } from "react"
import Axios from "axios"
import App from "./HomePage"

function Login() {
    //state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loginStatus, setStatus] = useState(false)

    //login request to the server
    function loginEmailPassword() {
        if (email.length != 0 && password.length != 0)
            Axios.post("auth/login", { "email": email, "password": password })
                .catch(x => {
                    let err = typeof (x.response['data']['message']) != "object" ?
                        x.response['data']['message'] :
                        x.response['data']['message'][0]['messages']
                    setError(err)
                })
        else
            setError("Please fill the empty field")
    }
    return loginStatus ? (<App />) : (
        <div className="login-container">
            <div style={error == "" ? { height: 400 } : { height: 420 }} className="center-container">
                <div className="form-container">
                    <h2>Login to Todo</h2>
                    <input required onChange={(e) => setEmail(e.currentTarget.value)} value={email} className="input-form" type="email" placeholder="E-mail" /><br />
                    <input required onChange={(e) => setPassword(e.currentTarget.value)} value={password} className="input-form" type="password" placeholder="Password" /><br />
                    {error == "" ? "" : (<div className="error-message-container"><span className="form-error-message">*{error}!<br /></span></div>)}
                    <button onClick={loginEmailPassword} className="login">Login</button><br />
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
                    </button><br />
                    <button className="login-social">Login with <span className="text-facebook">Facebook</span></button><br />
                    <button className="login-social">Login with <span className="text-github">Github</span></button><br />
                </div>
            </div>
        </div>
    )
}
export default Login;