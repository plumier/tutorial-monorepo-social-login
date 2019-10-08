import "../style/Home.css"
import LoginPage from "./LoginPage"
import React, { useEffect, useState } from "react"
import Axios from "axios"

function Home() {
  const [todoList, setTodoList] = useState<Todo[]>([])
  const [title, setTitle] = useState("")
  const [loginStatus,setLoginStatus]=useState(true)
  const refresh = () => {
    Axios.get<Todo[]>("/api/v1/todo")
      .then(x => {
        if (x.status === 200) {
          setTodoList(x.data || [])
        }
      })
      .catch(x => {
        if(x.response.status==403){
          setLoginStatus(false)
        }
      })
  }
  const saveTodo = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      Axios.post("/api/v1/todo", { title })
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
    Axios.delete(`/api/v1/todo/${id}`)
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const checkTodo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id = e.currentTarget.dataset.id
    Axios.put(`/api/v1/todo/${id}`, { completed: e.currentTarget.checked })
      .then(() => refresh())
      .catch(x => console.error(x))
  }
  const logOut = () => {
    Axios.get(`/auth/logout`)
      .then(()=>{window.location.reload()})
      .catch(x => console.error(x))
  }
  useEffect(() => {
    refresh()
  }, [])

  return !loginStatus ? (<LoginPage />) :(
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
