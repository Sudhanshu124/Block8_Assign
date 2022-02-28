import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import TicketController from "./ticket.controller";
import  TicketService  from "./ticket.service";
import {MongooseModule} from "@nestjs/mongoose";
import ticketSchema from "src/schema/ticket.schema";
import transactionSchema from "src/schema/transaction.schema";
import {authorizeTokenOnlyAdmin,customRequest,verifyToken, authorizeTokenOnlyUser} from "src/middlewares";
import userSchema from "src/schema/user.schema";
import DrawGateway from "./draw.gateway"
import { TransactionService } from "src/transaction/transaction.service";
import UserService from "src/user/user.service";

@Module({
    imports:[
        MongooseModule.forFeature([{name:'Ticket',schema:ticketSchema},{name:"User",schema:userSchema},{name:"Transaction",schema:transactionSchema}])
    ],
    controllers:[TicketController],
    providers:[TicketService,DrawGateway,TransactionService,UserService],
})
export default class TicketModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(authorizeTokenOnlyAdmin)
        .forRoutes({path:"/api/tickets",method:RequestMethod.POST});

        consumer.apply(authorizeTokenOnlyUser)
        .forRoutes({path:"/api/tickets/:id/:ticketId",method:RequestMethod.POST});
        consumer.apply(verifyToken)
        .forRoutes({path:"/api/tickets",method:RequestMethod.GET});
    }
}