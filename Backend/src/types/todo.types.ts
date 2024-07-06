import {Document} from "mongoose"
export interface TodoUser extends Document {
    title:string,
    description:string,
    completed?:boolean,
    user:string
    
}