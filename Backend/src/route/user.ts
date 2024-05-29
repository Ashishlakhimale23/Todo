import express from "express"
export const routeruser = express.Router()
import { handlelogin, handlesignin } from "../controller/user"
import { datavalidation } from "../middlerware/datavalidation"


routeruser.post("/signin",datavalidation,handlesignin)
routeruser.post("/login",handlelogin)
