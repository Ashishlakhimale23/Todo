import {  ReactNode , useState} from "react"
import { AuthContext } from "./context"
import axios from "axios"
import { api } from "../utils/axiosroutes"
interface Justachild{
  children:ReactNode
}


export function UserContext({children}:Justachild){

     const [logged,setLogged] = useState<boolean>(false)
     const [token,setToken] = useState(()=>{
       const authtoken = localStorage.getItem("authtoken") 
       return authtoken ? authtoken : ""
     })
     
     function settoken(token:string){
      if(token){
        setToken(token)
        localStorage.setItem("authtoken",token)
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`
        setLogged(true)
      }
      else{
        localStorage.removeItem("authtoken")
        delete axios.defaults.headers.common["Authorization"] 
        setLogged(false)
      }
     }
     

    return(
        <AuthContext.Provider value={{logged,setLogged,token,settoken}}>{children}</AuthContext.Provider>
    )
}
export default UserContext