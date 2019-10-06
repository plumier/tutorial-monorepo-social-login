import "../style/Login.css"
import React, { useState } from "react"
import { AxiosInstance, setAxiosDefaultHeader } from "../function/AxiosFunction"
import App from "./HomePage"

function Login(){
    //state
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loginStatus, setStatus] = useState(false)
    //check whether the user is already logged in on initial state
    async function checkLoginStatus(){
        if(!loginStatus)
        if( await setAxiosDefaultHeader())setStatus(true)
    }
    //calling check login status on initial state
    checkLoginStatus()
    //login request to the server
    async function loginEmailPassword():Promise<void>{
        if(email.length!=0&&password.length!=0)
        AxiosInstance.post("auth/login", { "email":email,"password":password })
        .then(x => {
            localStorage.setItem('token',x.data['token'])
            if(setAxiosDefaultHeader())setStatus(true)
        })
        .catch(x => {
            let err =typeof(x.response['data']['message'])!="object"?
                x.response['data']['message']:
                x.response['data']['message'][0]['messages']
            setError(err)
        })
        else
        setError("Please fill the empty field")
    }
    return loginStatus?(<App/>):(
        <div className="login-container">
            <div style={error==""?{height:400}:{height:420}} className="center-container">
                <div className="form-container">
                    <h2>Login to Todo</h2>
                    <input required onChange={(e)=>setEmail(e.currentTarget.value)} value={email} className="input-form" type="email" placeholder="E-mail"/><br/>
                    <input required onChange={(e)=>setPassword(e.currentTarget.value)} value={password} className="input-form" type="password" placeholder="Password"/><br/>
                    {error==""?"":(<div className="error-message-container"><span className="form-error-message">*{error}!<br/></span></div>)}
                    <button onClick={loginEmailPassword} className="login">Login</button><br/>
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