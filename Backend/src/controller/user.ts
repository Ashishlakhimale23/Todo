import { Request,Response } from "express"
import { User } from "../model/user"
import bcryptjs from "bcryptjs"
import jwt, { JsonWebTokenError, JwtPayload, TokenExpiredError, VerifyErrors } from "jsonwebtoken"
import { UserType } from "../types/user.types"
import {config} from "dotenv"
config()

export const handlesignin = async(req:Request<{},{},UserType>,res:Response)=>{
       const emailexsits=await User.findOne({email:req.body.email})  
       if(emailexsits){
        return res.json({message:"user already exists"}).status(409)
       }
       else{
       try{
        const hashedpassword:string = await bcryptjs.hash(req.body.password,10)
        if(!hashedpassword){
            return res.json({message:"password not hashed"}).status(500)
        } 
        const Newuser = new User( {
            email:req.body.email,
            username:req.body.username,
            password:hashedpassword
        })
         await Newuser.save().then(resp=>{
            const secretkey : string  = process.env.SECRET_KEY!
            const refreshkey : string  = process.env.REFRESH_KEY!
            const newtoken = jwt.sign({email:resp.email,id:resp._id},secretkey,{expiresIn:"7h"})
            const newrefreshtoken = jwt.sign({email:resp.email,id:resp._id},refreshkey,{expiresIn:"7d"})
            return res.status(200).json({authtoken:newtoken,refreshtoken:newrefreshtoken})

         }).catch(err=>{
            console.log(err)
            return res.status(500).json({message:"failed to save user"})
         })
       }
       catch(err){
        return res.status(500).json({message:"internal server error"})
       }
}
}

export const handlelogin=async(req:Request<{},{},UserType>,res:Response)=>{
    const userexist= await User.findOne({email:req.body.email}) as UserType | null
    if(!userexist ){
        return res.json({message:"user doesnt exist"}).status(404)
    }
    else{
    try{
        const hashpassword = userexist.password
        const checkpassword = await bcryptjs.compare(req.body.password,hashpassword)
        if(!checkpassword){
            return res.json({message:'incorrect password'}).status(404)
        }
        else{
        const secretkey:string = process.env.SECRET_KEY!
        const refreshkey:string = process.env.REFRESH_KEY!
        
            const newtoken = jwt.sign({email:req.body.email,id:userexist._id},secretkey,{expiresIn:"5m"})
            const newrefreshtoken = jwt.sign({email:req.body.email,id:userexist._id},refreshkey,{expiresIn:"7d"})
            return res.status(200).json({authtoken:newtoken,refreshtoken:newrefreshtoken})
}
        }
    catch(err){
        console.log(err)
        return res.status(500).json({message:"internal server error"})
    }
}
}

export const handlerefresh = async(req:Request,res:Response)=>{
    const {refreshtoken} = req.body 
    console.log(refreshtoken)
    const refreshkey = process.env.REFERSH_KEY!
    const secretkey = process.env.SECRET_KEY!
    try{
    jwt.verify(refreshtoken,refreshkey,(err:any,result:any)=>{
        if(err){
            return res.status(403).end()
        }
        if(result){
           const email =  (result as JwtPayload).email
           const id = (result as JwtPayload ).id
            
        const authtoken = jwt.sign({email:email,id:id},secretkey,{expiresIn:"7h"}) 
        const refreshtoken = jwt.sign({email:email,id:id},refreshkey,{expiresIn:"7d"})
        return res.json({"authtoken":authtoken,"refreshtoken":refreshtoken})
}
    })
}
catch(err){
    return res.json({message:"internal server error"})
}

}
