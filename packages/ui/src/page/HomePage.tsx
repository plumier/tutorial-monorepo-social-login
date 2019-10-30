import "../style/Home.css"

import Axios from "axios"
import React, { ChangeEventHandler, KeyboardEventHandler, MouseEventHandler, useEffect, useState } from "react"

import session from "./session"

export default function Home() {
  const [dropVisible, setDropVisible] = useState(false)
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [user, setUser] = useState<User>({} as User)
  const [title, setTitle] = useState("")
  const refresh = () => {
    Axios.get<Todo[]>("/api/v1/todos")
      .then(x => {
        if (x.status === 200) {
          setTodoList(x.data || [])
        }
      })
      .catch(x => console.error(x))
  }
  const loadUser = () => {
    Axios.get<User>("/api/v1/users/me")
      .then(x => {
        setUser(x.data)
      })
      .catch(x => console.error(x))
  }
  const saveTodo: KeyboardEventHandler = e => {
    if (e.key === "Enter") {
      Axios.post("/api/v1/todos", { title })
        .then(x => {
          refresh()
          setTitle("")
        })
        .catch(x => console.error(x))
    }
  }
  const deleteTodo: MouseEventHandler<HTMLAnchorElement> = e => {
    const id = e.currentTarget.dataset.id
    if (!window.confirm("Are you sure?")) return
    Axios.delete(`/api/v1/todos/${id}`)
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const checkTodo: ChangeEventHandler<HTMLInputElement> = e => {
    const id = e.currentTarget.dataset.id
    Axios.put(`/api/v1/todos/${id}`, { completed: e.currentTarget.checked })
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const logOut = () => {
    Axios.get("/auth/logout")
      .then(x => {
        session.clear()
        window.location.reload();
      })
      .catch(e => console.log(e))
  }

  useEffect(() => {
    loadUser()
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
            <a href="#" className="item" onClick={logOut}>Logout</a>
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
                <a data-id={x.id} href="#" onClick={deleteTodo}>Delete</a>
              </td>
            </tr>)
          }
        </tbody>
      </table>
    </div>
  );
}