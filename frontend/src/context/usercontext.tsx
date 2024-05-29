import { ReactNode, useState} from "react"
import { AuthContext } from "./context"
interface Justachild{
  children:ReactNode
}
function UserContext({children}:Justachild){
     const [logged,setLogged] = useState<boolean>(false)
    return(
        <AuthContext.Provider value={{logged,setLogged}}>{children}</AuthContext.Provider>
    )
}
export default UserContext