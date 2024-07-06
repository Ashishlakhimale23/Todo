import { createContext } from "react"
import { Dispatch,SetStateAction } from "react"

interface Logged {
  logged:boolean,
  setLogged:Dispatch<SetStateAction<boolean>>
  token:string,
  settoken:(token:string)=>void,
}
export const AuthContext = createContext<Logged>({
  logged: false,
  setLogged: () => {},
  token: "",
  settoken: () => {}
});