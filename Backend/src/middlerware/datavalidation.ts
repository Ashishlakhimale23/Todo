import joi from "joi";

export const datavalidation=(req:any,res:any,next:any)=>{
    const validation = joi.object().keys({
        username:joi.string().alphanum().min(3).max(20).required(),
        email:joi.string().email().required(),
        password:joi.string().pattern(new RegExp('^(?=.*[!@#$%^&*])(?=.{8,})')).min(8).max(20).required(),
    })
     


    const {username,email,password} = req.body;
    console.log(username,email);
    const data = {
        username:username,
        email:email,
        password:password
    }

    const {error,value}  = validation.validate(data)
    if(error){
        console.error("validation error",error)
        return res.json({"validation error":error})
    }
    if(value){
        
        next()
    }

     
}
