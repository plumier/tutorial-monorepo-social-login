import "../style/Home.css"

import Axios from "axios"
import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react"

import session from "./session"

export default function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [user, setUser] = useState<User>({} as User)
  const [title, setTitle] = useState("")
  const refresh = () => {
    Promise.all([
      Axios.get<Todo[]>("/api/v1/todos"),
      Axios.get<User>("/api/v1/users/me")
    ]).then(([resTodo, resUser]) => {
      setTodoList(resTodo.data || [])
      setUser(resUser.data)
    }).catch(console.error)
  }
  const saveTodo: KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      Axios.post("/api/v1/todos", { title })
        .then(x => {
          refresh()
          setTitle("")
        })
        .catch(console.error)
    }
  }
  const deleteTodo: MouseEventHandler<HTMLButtonElement> = e => {
    const id = e.currentTarget.dataset.id
    if (!window.confirm("Are you sure?")) return
    Axios.delete(`/api/v1/todos/${id}`)
      .then(() => refresh())
      .catch(console.error)
  }
  const checkTodo: ChangeEventHandler<HTMLInputElement> = e => {
    const id = e.currentTarget.dataset.id
    Axios.put(`/api/v1/todos/${id}`, { completed: e.currentTarget.checked })
      .then(() => refresh())
      .catch(console.error)
  }
  const logOut = () => {
    Axios.get("/auth/logout")
      .then(x => {
        session.clear()
        window.location.reload();
      })
      .catch(console.error)
  }

  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="container">
      <div className="header-container">
        <h2 className="title">Ngapain?</h2>
        <div className="user">
          <div className="avatar" style={{ backgroundImage: `url(${user.picture})` }}></div>
          <div className="name">
            <div className="item">{user.name}</div>
            <button className="item link-button" onClick={logOut}>Logout</button>
          </div>
        </div>
      </div>
      <input type="text" className="input-todo" placeholder="Something to do? type here..."
        onChange={x => setTitle(x.currentTarget.value)}
        onKeyUp={saveTodo} value={title} />
      <table>
        <tbody>
          {
            todoList.map(x => <tr key={x.id}>
              <td className="check">
                <input checked={x.completed} onChange={checkTodo} data-id={x.id} type="checkbox" />
              </td>
              <td className={x.completed ? "completed" : ""}>{x.title}</td>
              <td className="delete">
                <button className="link-button" data-id={x.id} onClick={deleteTodo}>Delete</button>
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  );
}