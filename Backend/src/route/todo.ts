import express from "express"
export const router = express.Router()
import {handlerpost,handelget,handeldelete, handelput} from "../controller/route"

router.post("/user",handlerpost)
router.get("/user",handelget)
router.delete("/delete",handeldelete)
router.put("/completed",handelput)


