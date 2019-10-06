import Axios from "axios"

const apiUrl="http://localhost:8000/"
export const AxiosInstance = Axios.create({
baseURL:apiUrl
})
// ------- FUNCTION ------- //
export async function setAxiosDefaultHeader(){
    let token=localStorage.getItem("token")
    if(!token)
    return false
    AxiosInstance.defaults.headers.common['Authorization'] = "Bearer "+token
    return true
}
