import express from "express";
import { userverification } from "../middleware/userverfication";
import { handlecompleted, handledelete, handlegettodo, handletodopost } from "../controller/todo";
export const TodoRouter = express.Router()
TodoRouter.post("/createtodo",userverification,handletodopost)
TodoRouter.get("/getalltodos",userverification,handlegettodo)
TodoRouter.post("/deletetodo",userverification,handledelete)
TodoRouter.post("/changestatus",userverification,handlecompleted)
