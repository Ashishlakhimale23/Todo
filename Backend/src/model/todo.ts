import { boolean, required } from "joi";
import mongoose from "mongoose";
const todo = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    completed:{
        type:Boolean,
        deafult:false,
        
    }
})
export const Todo = mongoose.model("Todo",todo)