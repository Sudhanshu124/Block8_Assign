import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {Model} from "mongoose";
import {userInterface,registerBody,loginBody} from "../schema/user.schema";
import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";

@Injectable()
export default class AuthService {

    constructor(@InjectModel("User") private User:Model<userInterface>){}

    //Register Service--------------------------------
    async register(body:registerBody){
            const hash=await bcrypt.hash(body.password,10);
            console.log("hello")
            if(!hash) throw new InternalServerErrorException("Not able to encrypt password");
            const user=new this.User({
                name:body.name,
                password:hash,
                email:body.email.toLowerCase(),
            });
            try{
                const savedUser=await user.save();
                const {_id,name,email,...others}=savedUser;
                return {_id,name,email};
            }catch(e:any){
                if( e.code===11000) throw new BadRequestException("User email ID already exists");
                throw new InternalServerErrorException(e.message);
            }
    }

    //Login Service-----------------------------------
    async login(body:loginBody){
        try{
            const dbResult=await this.User.findOne({email:body.email.toLowerCase()});
            if(!dbResult) throw new NotFoundException("No user found with this email")
            const compareResult=await bcrypt.compare(body.password,dbResult.password);
            if(!compareResult) throw new BadRequestException("Invalid credentials")
            const token:string=jwt.sign({
                    id:dbResult?.id,
                    isAdmin:dbResult?.isAdmin
            },process.env.JWT_SECRET,{expiresIn:"1h"});     
            return {id:dbResult.id,token:token,isAdmin:dbResult.isAdmin};
        }catch(e){
            if(e instanceof NotFoundException) throw new NotFoundException(e.message);
            else if(e instanceof BadRequestException) throw new BadRequestException(e.message);
            else throw new InternalServerErrorException(e.message);
        }
    }
}
