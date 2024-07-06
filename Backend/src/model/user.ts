
import mongoose from "mongoose";
const user = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    username:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    todos:[{
        type:mongoose.Types.ObjectId,
        ref:"Todo"
    }]
},{
    timestamps:true
})
export const User = mongoose.model("User",user)
