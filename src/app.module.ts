import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import AuthController from './auth/auth.controller';
import AuthService  from './auth/auth.service';
import {MongooseModule} from "@nestjs/mongoose";
import AuthModule from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import TicketModule from './ticket/ticket.module';
import UserModule from './user/user.module';
import TransactionModule from './transaction/transaction.module';

@Module({
  imports: [TransactionModule,UserModule,TicketModule,ConfigModule.forRoot(),AuthModule,MongooseModule.forRoot(process.env.MONGO_URL)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
