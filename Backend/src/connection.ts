import mongoose from "mongoose" 
export function connectiondb(url:string){
   return mongoose.connect(url)
}

