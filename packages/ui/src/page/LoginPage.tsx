import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { FormEventHandler, useState } from "react"
import { useHistory } from "react-router"
import * as popup from "./popup"

export default function Login() {
    const history = useHistory()
    const [error, setError] = useState<string | undefined>()

    const onSubmit: FormEventHandler<HTMLFormElement> = e => {
        e.preventDefault()
        const data = new FormData(e.currentTarget)
        Axios.post("/auth/login", data)
            .then(x => {
                setError(undefined)
                history.replace("/home")
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
            <a href="#" onClick={() => popup.google()}>Google</a>
            <a href="#" onClick={() => popup.facebook()}>Facebook</a>
            <a href="#" onClick={() => popup.github()}>Github</a>
            <a href="#">Register</a>
        </form>
    </div>
}