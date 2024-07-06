import  Login  from "./component/login"
import { PrivateRoute } from "./component/privateroutes"
import Signin from "./component/signin"
import Todo from "./component/todo"
import UserContext from "./context/usercontext"
import { Route,Routes } from "react-router-dom"
import { BrowserRouter as Router } from "react-router-dom"
function App() {
  const authtoken = localStorage.getItem('authtoken')
  return (
    <>
     <UserContext>
      <Router>
        <Routes>
          <Route path='/' element={authtoken ? <Todo/>:<Login/> }></Route>
         <Route path="/signin" element={<Signin/>}></Route>
         <Route path="/login" element={<Login/>}></Route>
         <Route element={<PrivateRoute/>}>
         <Route path="/home" element={<Todo/>}></Route>
</Route>
        </Routes>
      </Router>
     </UserContext>
      
    </>
  )
}

export default App
