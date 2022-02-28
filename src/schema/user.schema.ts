import { IsEmail, IsNotEmpty, Max, Min, MinLength ,MaxLength, IsOptional} from "class-validator";
import * as mongoose from "mongoose";


interface userInterface{
    name?:string;
    password:string;
    email:string;
    wallet?:number;
    isAdmin?:boolean;
    wonBids?:number;
    participatedBids?:number;

}


class registerBody implements userInterface {
    @IsNotEmpty()
    name:string;

    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    password:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
}

class loginBody implements userInterface {
    @MinLength(8)
    @MaxLength(20)
    @IsNotEmpty()
    password:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;
}

class updateUserBody {
    @IsOptional()
    name?:string;

    @MinLength(8)
    @MaxLength(20)
    @IsOptional()
    password?:string;

    @IsEmail()
    @IsOptional()
    email?:string;

    @IsOptional()
    wallet?:number;

    @IsOptional()
    isAdmin?:boolean
}

const userSchema=new mongoose.Schema<userInterface>({
    name:{type:String, required:true}, 
    password:{type:String, required:true},
    email:{type:String, required:true,unique:true},
    wallet:{type:Number,default:1000,min:0},
    isAdmin:{type:Boolean, default:false},
    participatedBids:{type:Number, default:0, required:false},
    wonBids:{type:Number, default:0, required:false}
},{timestamps:true})

export default userSchema;
export {loginBody,registerBody,userInterface,updateUserBody};


