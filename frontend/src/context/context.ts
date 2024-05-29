import { Dispatch, SetStateAction, createContext } from "react";
interface Authcontexttype{
    logged:boolean,
    setLogged:Dispatch<SetStateAction<boolean>>
}
export const AuthContext = createContext<Authcontexttype | undefined>(undefined)