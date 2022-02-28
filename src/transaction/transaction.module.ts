import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";
import {MiddlewareConsumer, Module, NestModule, RequestMethod} from "@nestjs/common";
import transactionSchema from "src/schema/transaction.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { authorizeTokenOnlyAdmin, authorizeTokenOnlyUserAndAdmin } from "src/middlewares";


@Module({
    imports: [MongooseModule.forFeature([{name: "Transaction",schema:transactionSchema}])],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export default class TransactionModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(authorizeTokenOnlyUserAndAdmin).forRoutes({path:'/api/transactions/user/:id',method: RequestMethod.GET});
        consumer.apply(authorizeTokenOnlyUserAndAdmin).forRoutes({path:'/api/transactions/:id',method: RequestMethod.GET});
        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/transactions/:id',method:RequestMethod.DELETE})
    }
    
} 