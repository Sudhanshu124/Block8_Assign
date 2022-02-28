import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Types } from "mongoose";
import { Socket } from "socket.io";
import { TransactionService } from "src/transaction/transaction.service";
import UserService from "src/user/user.service";
import ticketService from "./ticket.service";
import TicketService from "./ticket.service";

@WebSocketGateway({cors:true})
export default class DrawGateway{

    constructor(
        private readonly ticketService: TicketService,
        private readonly transactionService: TransactionService,
        private readonly userService: UserService){}

    @WebSocketServer()
    private server: { in: (arg0: string) => { (): any; new(): any; emit: { (arg0: string, arg1: string | number | Types.ObjectId): void; new(): any; }; }; };

    handleDisconnect(client){
        console.log("client disconnected")
    }

    handleConnection(client:Socket,data){
        console.log("Client connected")

        //On joining Room
        client.on("join",async (data)=>{

            //Retrieving ticket
            const ticket=await this.ticketService.getTicket(data.room);
            // if user is not in participants
            if(!ticket.participants.includes(data.id)){
                this.server.in(client.id).emit("message","Not allowed");
            }else {
                // Joining user to Ticket room
                await client.join(data.room);

                // Is participants length is less than 5
                if(ticket.participants.length<5)
                    this.server.in(data.room).emit("message","Waiting for "+(5-ticket.participants.length)+" more users to buy ticket");
                
                // if ticket is already drawn
                else if(ticket.drawn)
                    this.server.in(data.room).emit("message","This ticket has already been drawn, The winner was ID :"+ticket.winner);
                
                //Draw ticket
                else {
                    let count=10;
                    const interval=setInterval(async ()=>{
                        if(count===0){
                            //Choosing random participant
                             this.server.in(data.room).emit("count",count);
                            const winner=ticket.participants[Math.floor((Math.random() * 5))]
                            //Updating ticket with winner in DB
                            await this.ticketService.updateTicket(ticket._id.toString(),{drawn:true,winner:winner});
                            
                            //Create transaction for user--------------------------------------------------------
                            const user=await this.userService.getUser(winner+"");
                            await this.transactionService.createTransaction({userId:user._id,ticketId:data.ticketId,previousBalance:user.wallet,closingBalance:user.wallet+ticket.winningSum});
                            //Update winner user wallet--------------------------------------------------------
                            user.wallet=user.wallet+ticket.winningSum;
                            user.wonBids=user.wonBids+1;
                            await user.save();
                            //Emitting message to users connected in this room
                            this.server.in(data.room).emit("success",winner);   
                            clearInterval(interval);
                            return;
                        }
                        this.server.in(data.room).emit("count",count);
                        --count;
                    },1000)
                }
            }
        });
        
    }
}