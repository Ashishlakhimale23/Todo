import { NextFunction, Request,Response } from "express";
import { any } from "joi";
import jwt from "jsonwebtoken";
export async function handleauth(req:Request,res:Response,next:NextFunction){
    
const auth:any = req.headers.authorization || req.headers.Authorization;
if (!auth?.startsWith("Bearer ")) return res.json({ "status": "header not found" });
const Token = auth.split(' ')[1];

try {
    const decoded = jwt.verify(Token,"ashish");
    req.body.id=  (decoded as jwt.JwtPayload)._id;
    next();
} catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ "status": "Unauthorized" });
}
           

}

