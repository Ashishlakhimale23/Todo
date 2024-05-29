import { todo } from "../model/todo" 
import {user} from "../model/user" 
import jwt from "jsonwebtoken";


export async function handlerpost(req:any,res:any) {
    let useremail 
    
    let newtodo ={
        title:"",
        description:""
    }
    const { title, description} = req.body;
    console.log(title,description)
      const auth = req.headers.authorization || req.headers.Authorization 

    if(!auth?.startsWith("Bearer ")) return res.json({"status":"header not found"})
    const Token = auth.split(' ')[1];
    console.log(Token)
      jwt.verify(Token,"ashish",(resp:any,decoded:any)=>{
        if(resp){console.log(resp)}
        else{
            console.log(decoded)
            useremail= decoded.email;
            console.log(useremail)
        }
    })
    newtodo.title=title;
    newtodo.description=description; 
    const User:any = await user.findOne({email:useremail})
    console.log(User._id)
    await todo.updateOne({userid:User._id},{
        $push:{todouser:newtodo}    
    },{
        upsert:true
    })
     todo.findOne({ userid: User._id }).exec()
  .then((response:any) => {
    if (!response) {
      console.log("Todo not found");
      return;
    }
    console.log(response.todouser);
    res.send(response.todouser)
  })
  .catch((err:any) => {
    console.log(err);
  });
   
}

export async function handelget(req:any,res:any){
  let useremail
  const auth = req.headers.Authorization || req.headers.authorization
  if(!auth.startsWith('Bearer ')) return res.send("header not found")
  const token = auth.split(' ')[1]
  jwt.verify(token,"ashish",(err:any,decoded:any)=>{
    if(err){
      console.log(err)
    }
    else{
      console.log(decoded.email)
      useremail = decoded.email
    }
  })

  const User:any = await  user.findOne({email:useremail})
  await todo.findOne({userid:User._id}).exec()
  .then((resp:any)=>{
    res.send(resp.todouser)
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


export const handelput = async (req:any,res:any) =>{
  try{
    console.log(req.body)
  const {id} = req.body;
  console.log(id)
   await todo.findOneAndUpdate({"todouser._id":id},{$set:{"todouser.$.completed":true}},
   {new:true}
  ).exec().then((resp:any)=>{
    console.log(resp)
    
    res.send("updated successfully")
  }).catch((error:any)=>console.log(error))}
  
  catch(error){
    console.log(error)
  }
 
}


