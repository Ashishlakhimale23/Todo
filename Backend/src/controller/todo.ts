import { Request,Response } from "express"
import { Todo } from "../model/todo"
import { User } from "../model/user"
import { TodoUser } from "../types/todo.types"
import { UserType } from "../types/user.types"
import { connect, ObjectId } from "mongoose"

export const handletodopost = async (req:Request<{},{},TodoUser>,res:Response)=>{
    const userid =req.body._id

 try{
       const newTodo = new Todo({
        title:req.body.title,
        description:req.body.description,
        completed:req.body.completed
    })

    await newTodo.save().then(async(resp)=>{
        await User.findByIdAndUpdate({_id:userid},{
           $push:{
            "todos":resp._id
           } 
        }).then((resp)=>{
            return res.json({message:'todo created'}).status(200)
        }).catch(err=>{
            return res.json({message:'error occured while push the user id '}).status(500)
        })
    }).catch(err=>{
        console.log(err)
        return res.json({message:"error while creating a todo"}).status(500)
    })
}
catch(err){
   return res.json({message:"internal server error"}).status(500) 
}

    
}

export const handlegettodo = async (req:Request<{},{},UserType>,res:Response)=>{
    try{
await User.findOne({_id:req.body._id}).populate('todos',"title description completed").select('todos')
    .then((resp)=>{
        console.log(resp)
        return res.json({data:resp}).status(200)
    })
    .catch(err=>{
        return res.json({message:"error while quering the data"})
    })
}
catch(err){
    return res.json({message:"internal error occured"}).status(500)
}



}

export const handledelete=async (req:Request,res:Response)=>{
    const {deleteid} = req.body
    if(!deleteid){
        return res.json({message:"id to delete dosent exists"})
    }
    try{
        await User.findByIdAndUpdate({_id:req.body._id},{
            $pull:{
                "todos":deleteid
            }
        }).then(async()=>{
            await Todo.findByIdAndDelete({_id:deleteid})
            .then(()=>{
                return res.json({message:"todo deleted"}).status(200)
            }).catch(()=>{
                return res.json({message:"while deleting the todo"}).status(500)
            })        
            }).catch(()=>{
                return res.json({message:"while pulling the todo"}).status(500)
            })


    }
    catch(err){
        return res.json({message:"internal error"}).status(500)
    }

}

export const handlecompleted=async(req:Request,res:Response)=>{
    const {id,result} = req.body
    if(!id){
        return res.json({message:"id not received"}).status(409)
    }
    try{
        const todo:TodoUser | null= await Todo.findOne({_id:id})
        if(!todo){
            return res.json({message:"failed to access the todo"}).status(500)
        }
        todo.completed = !result;
        todo.save().then(()=>{
            return res.json({message:"changed the completed status"}).status(200)
        })

    }
    catch(err){
        return res.json({message:"internal error"}).status(500)
    }
}