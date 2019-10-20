import "../style/Home.css"

import React, { useEffect, useState } from "react"
import Axios from "axios"

function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([])
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
  const saveTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      Axios.post("/api/v1/todos", { title })
        .then(x => {
          refresh()
          setTitle("")
        })
        .catch(x => console.error(x))
    }
  }
  const deleteTodo = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const id = e.currentTarget.dataset.id
    if (!window.confirm("Are you sure?")) return
    Axios.delete(`/api/v1/todos/${id}`)
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const checkTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id
    Axios.put(`/api/v1/todos/${id}`, { completed: e.currentTarget.checked })
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const logOut = () => {
    window.location.reload();
  }
  useEffect(() => {
    refresh()
  }, [])

  return (
    <div className="container">
      <div className="header-container">
        <div><h1>Welcome to To-do</h1></div>
        <button className="logout-button" onClick={logOut}>Logout</button>
      </div>
      <table>
        <thead>
          <tr>
            <td colSpan={3}>
              <input type="text" className="add-todo input-todo" placeholder="Something to do? type here..."
                onChange={x => setTitle(x.currentTarget.value)}
                onKeyUp={saveTodo} value={title} />
            </td>
          </tr>
        </thead>
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

export default Home;
