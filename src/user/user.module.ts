import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import UserController from "./user.controller";
import UserService from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import userSchema from "../schema/user.schema"
import { authorizeTokenOnlyAdmin, authorizeTokenOnlyUserAndAdmin } from "src/middlewares";

@Module({
    imports: [MongooseModule.forFeature([{name:"User",schema:userSchema}])],
    controllers:[UserController],
    providers:[UserService],
})
export default class UserModule implements NestModule{
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(authorizeTokenOnlyUserAndAdmin).forRoutes({path:'/api/users/:id',method: RequestMethod.GET});
        consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/users/:id',method: RequestMethod.PUT});
         consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/users/:id',method: RequestMethod.DELETE});
          consumer.apply(authorizeTokenOnlyAdmin).forRoutes({path:'/api/users',method: RequestMethod.GET});
    }
    
} {}