import express from "express"
import { handlelogin, handlerefresh, handlesignin } from "../controller/user"
export const UserRouter = express.Router()
UserRouter.post("/signin",handlesignin)
UserRouter.post("/login",handlelogin)
UserRouter.post("/refresh",handlerefresh)
