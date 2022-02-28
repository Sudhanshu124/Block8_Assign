import { BadRequestException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as mongoose from "mongoose";
import { Model } from 'mongoose';
import { transactionInterface,transactionBody } from 'src/schema/transaction.schema';
@Injectable()
export class TransactionService {

    constructor(@InjectModel("Transaction") private transactionModel:Model<transactionInterface>){}

    async getUserTransactions(userId: string)
    {
       if(!mongoose.Types.ObjectId.isValid(userId))
         throw new BadRequestException("Invalid user Id"); 

        try{
            const transactions = await this.transactionModel.find({userId : userId})
            return transactions;
        }catch(e){
            throw new BadRequestException(e.message);
        }
       
    }

    async createTransaction(body:transactionBody){
        const transaction = new this.transactionModel(body);

        try{
            const savedTransaction = await transaction.save();
            return savedTransaction;
        }catch(e){
            throw new InternalServerErrorException(e.message);
        }
    }

    async getTransactionbyId(transactionId: string)
    {
        if(!mongoose.Types.ObjectId.isValid(transactionId))
         throw new BadRequestException("Invalid transaction ID");

        try{
            const transactionbyId= await this.transactionModel.findOne({_id:transactionId})
            if(!transactionbyId) throw new NotFoundException("No such transaction found")
            return transactionbyId;
        }catch(e){
            if(e instanceof NotFoundException) throw new NotFoundException(e.message);
            else throw new InternalServerErrorException(e.message);
        }
        
    }
    

    async deleteTransaction(transactionId: string)
    {
        if(!mongoose.Types.ObjectId.isValid(transactionId))
         throw new BadRequestException("Invalid transaction ID");

         try{
            const result=await this.transactionModel.findByIdAndDelete(transactionId);
            if(!result) throw new NotFoundException("No such transaction found");
            return {message:"Transaction successfully deleted"}
         }catch(e){
             if(e instanceof NotFoundException) throw new NotFoundException(e.message);
             else throw new InternalServerErrorException(e.message);
         }
        
    }
}