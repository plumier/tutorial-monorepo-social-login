import "../style/Login.css"

import Axios, { AxiosError } from "axios"
import React, { FormEventHandler, useState } from "react"
import { useHistory } from "react-router"
import { Link } from "react-router-dom"

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
  const [validation, setValidation] = useState<Partial<RegisterValidationMessage>>({})
  const history = useHistory()

  const onSubmit: FormEventHandler<HTMLFormElement> = e => {
    //in case of simple form submission, its not necessary to use controlled component form 
    //by using several fields and onChange events then compose the JSON manually
    //instead, we can use traditional way by providing name for each form input 
    //then send it using HTML 5 FormData. It will send form data in multipart form data 
    //another alternative you can use form-serializer to serialize the form and send using url encoded
    e.preventDefault()
    setValidation({})
    const data = new FormData(e.currentTarget)
    Axios.post("/api/v1/users", data)
      .then(x => {
        document.getElementsByTagName("form")[0].reset()
        alert("User saved successfully")
        history.push("/")
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
      <Link to="/">Go Back</Link>
    </form>
  </div>
}