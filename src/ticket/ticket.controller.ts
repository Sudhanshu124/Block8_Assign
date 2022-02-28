import { Body, Controller, Param, Post,Put,Get,Query,Delete} from '@nestjs/common';
import {getTicketBody, ticketBody,updateTicketBody} from "../schema/ticket.schema";
import ticketService from './ticket.service';
import TicketService from './ticket.service';
import * as mongoose from "mongoose";

@Controller('api/tickets')
export default class TicketController {
    
    constructor(private ticketService: TicketService){}

    //create a ticket-----------------
    @Post()
    async createTicket(@Body() body:ticketBody){
        return await this.ticketService.createTicket(body);
    }

    //Buy a ticket----------------------
    @Post('/:id/:ticketId')
    async buy(@Param('id') userId:string,@Param('ticketId') ticketId:string){
        return await this.ticketService.buyTicket(userId,ticketId);
    }

    @Put("/:id")
    async updateTicket(@Param('id') id:string,@Body() body:updateTicketBody){
        return await this.ticketService.updateTicket(id,body);
    }

    @Get("/:id")
    async getTicket(@Param("id") id:string){
       return await this.ticketService.getTicket(id);
    }

    @Get()
    async getTickets(@Query() query:getTicketBody){
       return await this.ticketService.getTickets(query);
    }

    @Delete('/:id')
    async deleteTicket(@Param("id") id:string){
        return await this.ticketService.deleteTicket(id);
    }

    
}
