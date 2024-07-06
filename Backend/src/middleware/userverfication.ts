import { Request,Response,NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken"

export async function userverification(req:Request,res:Response,next:NextFunction){
    const authtoken = req.headers.authorization || req.headers.Authorization
    console.log(authtoken)
    if(!authtoken || typeof authtoken !="string" || !authtoken?.startsWith("Bearer ")){
        return res.json({message:"header not found"}).status(400)
    }
    try{
    const token = authtoken.split(" ")[1]
    const secretkey = process.env.SECRET_KEY!
    
     jwt.verify(token,secretkey,(err,user)=>{
        if(err){
           console.log(err)
            return res.status(401).end()
        }
        req.body._id = (user as JwtPayload).id
        next()
    })

    }
    catch(err){
        return res.json({message:'internal error'}).status(500)
    }


}