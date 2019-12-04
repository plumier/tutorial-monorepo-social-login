import "../style/App.css"

import Axios, { AxiosError } from "axios"
import React, { useContext, useEffect, useState } from "react"

import { LoginUserContext } from "../context"

export default function Header() {
  const [login, setLogin] = useContext(LoginUserContext)
  const [user, setUser] = useState<Partial<User>>({})

  useEffect(() => {
    Axios.get<User>("/api/v1/users/me")
      .then(x => setUser(x.data))
      .catch((x: AxiosError) => {
        if (x.response && x.response.status === 403) {
          setUser({})
        }
      })
  }, [login])

  const logOut = () => {
    Axios.get("/auth/logout")
      .then(x => {
        setLogin(false)
        window.location.reload();
      })
      .catch(console.error)
  }
  return <>
    <div className="header-container">
      <h2 className="title">Ngapain?</h2>
      {
        login ? <div className="user">
          <div className="avatar" style={{ backgroundImage: `url(${user.picture})` }}></div>
          <div className="name">
            <div className="item">{user.name}</div>
            <button className="item link-button" onClick={logOut}>Logout</button>
          </div>
        </div> : ""
      }
    </div>
    <div className="container"></div>
  </>
}