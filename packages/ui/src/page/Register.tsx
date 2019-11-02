import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { FormEventHandler, useState } from "react"
import { useHistory } from "react-router"

function getValidationMessage(data: { path: string[], messages: string[] }[]) {
  const result: { [key: string]: string } = {}
  for (const item of data) {
    result[item.path[item.path.length - 1]] = item.messages[0]
  }
  return result as any;
}

interface RegisterValidationMessage {
  name: string
  email: string
  password: string
  confirmPassword: string
}

export default function Register() {
  const [validation, setValidation] = useState<RegisterValidationMessage>({} as any)

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    //in case of simple form submission, its not necessary to use controlled component form 
    //using several fields and onChange event then compose the JSON manually
    //instead, we can use traditional way by providing name for each form input 
    //then send it using HTML 5 FormData
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    Axios.post("/api/v1/users", data)
      .then(x => {
        e.currentTarget.reset()
      })
      .catch((e: AxiosError) => {
        if (e.response && e.response.status === 422)
          setValidation(getValidationMessage(e.response.data.message))
        else if (e.response && e.response.status !== 200)
          alert("Internal server error occur")
      })
  }

  return <div className="login-container">
    <form onSubmit={onSubmit}>
      <input className="has-validator" name="name" type="text" placeholder="Name" />
      <span className="err">{validation.name}</span>
      <input className="has-validator" name="email" type="text" placeholder="Email" />
      <span className="err">{validation.email}</span>
      <input className="has-validator" name="password" type="password" placeholder="Password" />
      <span className="err">{validation.password}</span>
      <input className="has-validator" name="confirmPassword" type="password" placeholder="Confirm password" />
      <span className="err">{validation.confirmPassword}</span>
      <button type="submit">Submit</button>
      <a href="/">Go Back</a>
    </form>
  </div>
}