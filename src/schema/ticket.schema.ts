import * as mongoose from "mongoose";
import {IsArray, IsDate, IsDivisibleBy, IsNotEmpty, IsOptional, Min, validate} from "class-validator";

interface ticketInterface{
    winningSum:number,
    participants:[mongoose.Types.ObjectId],
    buyPrice?:number,
    startedOn:Date,
    drawn?:boolean,
    winner?:mongoose.Types.ObjectId
}


class ticketBody implements ticketInterface{
    
    @IsDivisibleBy(5)
    @Min(500)
    @IsNotEmpty()
    winningSum:number;

    @IsNotEmpty()
    @IsArray()
    participants:[mongoose.Types.ObjectId];

    @IsNotEmpty()
    startedOn:Date;
}

class updateTicketBody{
    @IsDivisibleBy(5)
    @Min(500)
    @IsOptional()
    winningSum?:number;

    @IsOptional()
    participants?:[mongoose.Types.ObjectId];

    @IsOptional()
    startedOn?:Date;

    @IsOptional()
    buyPrice?:number;

    @IsOptional()
    drawn?:boolean;

    @IsOptional()
    winner?:mongoose.Types.ObjectId;
}

const sizeValidator=(val)=>{
    return val.length<=5;
}

const ticketSchema=new mongoose.Schema<ticketInterface>({
    winningSum:{type:Number, required:true},
    startedOn:{type:Date, required:true},
    participants:{type:[mongoose.Types.ObjectId],required:true,validate:[sizeValidator,"Ticket has been sold out"]},
    buyPrice:{type:Number, required:true},
    drawn:{type:Boolean, default:false},
    winner:{type:mongoose.Types.ObjectId, required:false}
},{timestamps:true});


class getTicketBody{
    @IsOptional()
    sort?:string;
}

export default ticketSchema;
export {ticketBody,ticketInterface,updateTicketBody,getTicketBody};