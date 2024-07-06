import express from "express"
import {UserRouter}  from "./routes/user"
import { TodoRouter } from "./routes/todo"
import cors from "cors"
import { connection } from "./connection"
import { config } from "dotenv"
config()
const dburl:string = process.env.DBURL!

const app  = express()
app.use(cors())
app.use(express.urlencoded({extended:false}))
app.use(express.json())
app.use("/user",UserRouter)
app.use("/todo",TodoRouter)
connection(dburl).then(()=>{
app.listen(8000,()=>{
    console.log("running on port 8000")
})
}).catch(err=>console.log(err))
