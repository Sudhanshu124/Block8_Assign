import {BadRequestException, Injectable, InternalServerErrorException, NotFoundException} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import {Model} from "mongoose";
import { updateUserBody, userInterface } from "src/schema/user.schema";
import * as mongoose from "mongoose";

@Injectable()
export default class UserService{

    constructor(@InjectModel("User") private readonly userDB:Model<userInterface>){}

    async getAllUsers(){
        try{
            return await this.userDB.find();
        }catch(e){
            throw new InternalServerErrorException(e.message)
        }
    }


    async getUser(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid ID")
        try{
            const user=await this.userDB.findById(id);
            if(!user) throw new BadRequestException("No such user Found");
            else return user;
        }catch(e){
            throw new BadRequestException(e.message)
        }
    }

    async deleteUser(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid ID")
        try{
            const user=await this.userDB.findByIdAndDelete(id);
            if(!user) throw new BadRequestException("No such user")
            return {message:"User has been successfully deleted"};
        }catch(e){
            throw new BadRequestException(e.message)
        }
    }


    async updateUser(id:string,body:updateUserBody){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid User Id")
        try{
            const ticket=await this.userDB.findByIdAndUpdate(
                id,
                {$set:{...body}},
                {new:true}
            );
            if(!ticket) throw new NotFoundException("No User found with the provided ID")
            return ticket;
        }catch(e){
            throw new BadRequestException(e.message);
        }
    }
}