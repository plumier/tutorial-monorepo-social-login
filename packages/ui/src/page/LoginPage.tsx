import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { FormEventHandler, useState } from "react"
import { useHistory } from "react-router"
import * as popup from "./popup"
import session from "./session"


export default function Login() {
    const history = useHistory()
    const [error, setError] = useState<string | undefined>()

    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        Axios.post("/auth/login", data)
            .then(x => {
                setError(undefined)
                session.save()
                history.replace("/")
            })
            .catch((e: AxiosError) => {
                if (!e.response) return console.log(e)
                if (e.response.status === 422)
                    return setError("Invalid email or password")
                console.log(e)
            })
    }

    return <div className="login-container">
        <form onSubmit={onSubmit}>
            <input name="email" type="email" placeholder="Email" />
            <input name="password" type="password" placeholder="Password" />
            {!!error ? (<div className="error">{error}</div>) : ""}
            <button type="submit">Login</button>
            <div className="social-login">
                <a href="#" onClick={() => popup.google()}><span className="icon-google"></span></a>
                <a href="#" onClick={() => popup.facebook()}><span className="icon-facebook-official"></span></a>
                <a href="#" onClick={() => popup.github()}><span className="icon-github"></span></a>
            </div>
            <p>
                Not a member yet? click <a href="#">here</a> to register
            </p>
        </form>
    </div>
}