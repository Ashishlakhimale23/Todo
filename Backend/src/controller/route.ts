import { todo } from "../model/todo" 
import {user} from "../model/user" 
import jwt from "jsonwebtoken";
import { Request,Response } from "express";


export async function handlerpost(req:Request,res:Response) {
    
    const newtodo={
      title:String,
      description:String,
    } 

    const { title,description,id} = req.body;
    console.log(req.body)

    newtodo.title=title;
    newtodo.description=description; 
    await todo.updateOne({userid:id},{
        $push:{todouser:newtodo}    
    },{
        upsert:true
    })
     todo.findOne({ userid:id }).exec()
  .then((response:any) => {
    if (!response) {
      return res.json({error:"cant find the user"});
    }
    res.send(response.todouser)
  })
  .catch((err:any) => {
    console.log(err);
  });
   
}

export async function handelget(req:Request,res:Response){
  const {id} = req.body;
  const User:any = await  user.findById(id)
  await todo.findOne({userid:User._id}).exec()
  .then((resp:any)=>{
    return res.json({data:resp.todouser})
  }).catch((error:any)=>console.log(error))
}

export async function handeldelete(req:any,res:any){
  
  
  try{
    console.log(req.body)
  const {deleteid} = req.body
  console.log(deleteid)
  const response = await todo.findOneAndUpdate(
  { "todouser._id": deleteid },
  { $pull: { "todouser": { _id: deleteid } } }
);

  if(response) {
    console.log(response)
  }
  else{
    console.log("id not fonud")
  }
  console.log("deleted successfully")
  res.send(" deleted successfully")

  }
  catch(error){
    console.log(error)
  }

}


export const handelput = async (req:Request,res:Response) =>{
  try{
  const {id} = req.body;
   await todo.findOneAndUpdate({"todouser._id":id},{$set:{"todouser.$.completed":true}},
   {new:true}
  ).exec().then((resp:any)=>{
    console.log(resp)
    
    return res.send("updated successfully")
  }).catch((error:any)=>console.log(error))}
  
  catch(error){
    console.log(error)
  }
 
}


