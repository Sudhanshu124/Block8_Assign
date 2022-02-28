import { Body, Delete } from '@nestjs/common';
import { Controller, Get, Param, Post } from '@nestjs/common';
import { TransactionService } from './transaction.service';

@Controller('api/transactions')
export class TransactionController {

    constructor(private transactionService: TransactionService){}

    //get a transaction
    @Get('/:id')
    async getTransactionbyId(@Param('id') id:string){
        return await this.transactionService.getTransactionbyId(id);
    }

    //Get all transactions for a user
    @Get('/user/:id')
    async getTransactionsForUser(@Param('id') userId:string)
    {
      return await this.transactionService.getUserTransactions(userId)
    }
   
    //Delete a transaction
    @Delete('/:id')
    async deleteTransactionById(@Param("id") id:string)
    {
      return await this.transactionService.deleteTransaction(id);
    }

   
}