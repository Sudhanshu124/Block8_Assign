import express,{Request, Response,NextFunction} from "express";
import * as jwt from "jsonwebtoken";


interface customRequest extends Request {
    user?:any;
}

const verifyToken=(req:customRequest, res:Response,next:NextFunction)=>{
    const authHeader:string| undefined =req.headers.token as string;
    if(!authHeader) return res.status(401).send({error:"You are not authenticated"});
    else{
        const authToken:string=authHeader.split(" ")[1];
        jwt.verify(authToken,process.env.JWT_SECRET as string,(err,userData)=>{
            if(err) return res.status(401).send({error:"Token not valid"});
            else{
                req.user=userData;
                next();
            }
        })
    }
}

//Authorized only for admin
const authorizeTokenOnlyAdmin=(req:customRequest, res:Response, next:NextFunction) => {
    verifyToken(req, res, ()=>{
        if(req.user.isAdmin){
             next();
        }
        else return res.status(401).send({error:"You are not authorized to make this request"});
    });
}

// Authorized for same user or admin
const authorizeTokenOnlyUserAndAdmin=(req:customRequest, res:Response, next:NextFunction) => {
   
    verifyToken(req, res, ()=>{
        if(req.params.id===req.user.id || req.user.isAdmin){
             next();
        }
        else return res.status(401).send({error:"You are not authorized to make this request"});
    });
}

//Authorized for user only
const authorizeTokenOnlyUser=(req:customRequest, res:Response, next:NextFunction) => {
    verifyToken(req, res, ()=>{
        if(!req.user.isAdmin){
             next();
        }
        else return res.status(401).send({error:"You are not authorized to make this request"});
    });
}

export {authorizeTokenOnlyUserAndAdmin,authorizeTokenOnlyAdmin,authorizeTokenOnlyUser,customRequest,verifyToken};