import { BadRequestException, Injectable, InternalServerErrorException, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel,InjectConnection } from '@nestjs/mongoose';
import {connection, Connection, Model} from "mongoose";
import {getTicketBody, ticketBody,ticketInterface, updateTicketBody} from "../schema/ticket.schema";
import {userInterface} from "../schema/user.schema"
import {transactionInterface} from "../schema/transaction.schema"
import * as mongoose from "mongoose";

@Injectable()
export default class TicketService {
    constructor(@InjectModel("Ticket") private ticketDB:Model<ticketInterface>,
                @InjectModel("User") private userDB:Model<userInterface>,
                @InjectModel("Transaction") private transactionDB:Model<transactionInterface>,
                @InjectConnection() private connection:mongoose.Connection
    ){}

    async createTicket(body:ticketBody){

        const ticket=await this.ticketDB.create({...body,buyPrice:body.winningSum/5});
        try{
            const savedTicket=await ticket.save();
            return {ticket:savedTicket};
        }catch(e){
            throw new InternalServerErrorException(e.message);
        }
    }

    async buyTicket(userId:string,ticketId:string){

        //validating userId and ticketId---
        if(!mongoose.Types.ObjectId.isValid(userId))
            throw new BadRequestException("User Id is invalid");
        if(!mongoose.Types.ObjectId.isValid(ticketId))
            throw new BadRequestException("Ticket Id is invalid");

        const maxParticipantsLength:number=5;

        //Starting transaction------
        const session=await this.connection.startSession();
        session.startTransaction();
        
        const user=await this.userDB.findById(userId).session(session);
        //if no such user--
        if(!user) {
                throw new NotFoundException("No such user found with ID: "+userId);
        }
        const ticket=await this.ticketDB.findById(ticketId).session(session);;
        //if no such ticket----
        if(!ticket){
            throw new NotFoundException("No such ticket found with ID: "+ticketId);
        }
        //if doesnt have sufficient amount in his wallet
        if(user.wallet<ticket.buyPrice) {
             throw new NotAcceptableException("You do not have sufficient balance");
        }
        //if all tickets sold----
        if(ticket.participants.length >= maxParticipantsLength){
            throw new NotAcceptableException("No tickets left for this Lottery.")
        }
        
        //creating a transaction
        
        const transaction= new this.transactionDB({
            userId:user._id,
            ticketId:ticket._id,
            previousBalance:user.wallet,
            closingBalance:user.wallet-ticket.buyPrice
        })
        //updating user balance
        user.wallet=user.wallet-ticket.buyPrice;
        user.participatedBids=user.participatedBids+1;
        //updating participants
       
        
        ticket.participants.push(user._id);
        try{
            await user.save();
            await ticket.save();
            const createdTransaction = await transaction.save();
            await session.commitTransaction();
            session.endSession();
            return {message:"Ticket bought successfully", data:createdTransaction}
        }catch(e){
            await session.abortTransaction();
            throw new BadRequestException(e.message);
        }

    }


    async updateTicket(id:string,body:updateTicketBody){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid Ticket Id")
        try{
            const ticket=await this.ticketDB.findByIdAndUpdate(
                id,
                {$set:{...body}},
                {new:true}
            );
            if(!ticket) throw new NotFoundException("No ticket found with the provided ID")
            return ticket;
        }catch(e){
            if(e instanceof NotFoundException) throw new NotFoundException(e.message);
            else throw new InternalServerErrorException(e.message);
        }
    }

    async getTicket(id:string){
        if(!mongoose.Types.ObjectId.isValid(id)) throw new BadRequestException("Invalid Ticket ID");
        try{
            const ticket=await this.ticketDB.findById(id);
            if(!ticket) throw new NotFoundException("Could not find a ticket with this ID");
            return ticket;
        }catch(e){
            if(e instanceof NotFoundException) throw new NotFoundException(e.message);
            else throw new InternalServerErrorException(e.message);
        }
    }


    async deleteTicket(ticketId: string) {
        if(!mongoose.Types.ObjectId.isValid(ticketId)) throw new BadRequestException("Invalid Ticket ID");
        try{
            const result=await this.ticketDB.deleteOne({ _id: ticketId });
            if(!result) throw new NotFoundException("No such ticket found");
            return {message:'ticket has been deleted successfully'};
        }catch(e){
            if(e instanceof NotFoundException) throw new NotFoundException(e.message);
            else throw new InternalServerErrorException(e.message);
        }
       
    }

    async getTickets(query:getTicketBody) {

    
        try {
            if(query.sort==='closed'){
                return await this.ticketDB.find({participants:{$size:5}})
            }
            else if(query.sort==='open'){ 

                return await this.ticketDB.find({participants:{$not:{$size:5}}})

            }
            else{
                return await this.ticketDB.find()
            }
        }catch(e) {
            throw new InternalServerErrorException(e.message);
        }
    }
}

