import "../style/Login.css"
import React, { useState } from "react"
import axios from "axios"
import { Link } from "react-router-dom"
import { loginEmail, AxiosInstance, setAxiosDefaultHeader } from "../function/AxiosFunction"
import App from "../App"

function Login(){
    //state
    const [email, setEmail]= useState("")
    const [password, setPassword]= useState("")
    const [error, setError] = useState("Login to Todo")
    const [loginStatus, setStatus] = useState(false)
    
    //check whether the user is already logged in on initial state
    function checkLoginStatus(){
        if(!loginStatus)
        if(setAxiosDefaultHeader())setStatus(true)
    }
    //calling check login status on initial state
    checkLoginStatus()
    //login request to the server
    async function loginEmailPassword():Promise<void>{
        if(email.length!=0&&password.length!=0)
        AxiosInstance.post("auth/login", { "email":email,"password":password })
        .then(x => {
          if(x.status===200){
              localStorage.setItem('token',x.data['token'])
              if(setAxiosDefaultHeader())setStatus(true)
              console.log(x.data['token'])
          }else{
            console.log(x.status)
          }
          
        })
        .catch(x => {
            let err=x.response['data']['message']
            setError(err)
            console.log(err)
        })
        else
        setError("Please fill the empty field")
    }
    return loginStatus?(<App/>):(
        <div className="login-container">
            <div className="center-container">
                <div className="form-container">
                    <h2>{error}</h2>
                    <input required onChange={(e)=>setEmail(e.currentTarget.value)} value={email} className="input-form" type="text" placeholder="E-mail"/><br/>
                    <input required onChange={(e)=>setPassword(e.currentTarget.value)} value={password} className="input-form" type="password" placeholder="Password"/><br/>
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