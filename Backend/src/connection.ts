import mongoose from "mongoose";

export async function connection(url:string){
    await mongoose.connect(url).then(res=>console.log("database connected"))
    .catch(err=>console.log(err))
}