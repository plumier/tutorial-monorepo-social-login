import Axios from "axios"

const apiUrl="http://localhost:8000/"
export const AxiosInstance = Axios.create({
baseURL:apiUrl
})
// ------- FUNCTION ------- //
export function setAxiosDefaultUrl(){
    //AxiosInstance.defaults.baseURL=apiUrl
    AxiosInstance.interceptors.response.use(
    function (response) {
    return response;
    }, 
    function (error) {
    if(!error.response){
        console.log(error)
        //Alert.alert("Network Error","Please check your internet connection")
    }else{
        console.log(error.response)
        if(typeof (error.response.data )==="string"){
        //Alert.alert(error.response.data)
        }else if(typeof (error.response.data[0].messages[0])==="string"){
        //Alert.alert(error.response.data[0].messages[0])
        }else{
        //Alert.alert("Request failed",error.status)
        }
    }
    //return Promise.reject(error);
    });
}
export async function setAxiosDefaultHeader(){
    let token=localStorage.getItem("token")
    if(!token)
        return false
    AxiosInstance.defaults.headers.common['Authorization'] = "Bearer "+token
    return true
}

export async function loginEmail(email:string,password:string):Promise<Array<any>>{
    let token : string=''
    await AxiosInstance
        .post('auth/login',{"email":email,"password":password})
        .then((result)=>{
            if(result.status===200){
                token=result.data['token']
                localStorage.setItem('token',token)
                return [true,token]
            }
            console.log(result.status)
            return [false,result.status]
        }).catch(e=>{
            return[false,e]
        });
        return [false]
}
