import { Module } from "@nestjs/common";
import AuthService from "./auth.service";
import AuthController from "./auth.controller";
import {MongooseModule} from "@nestjs/mongoose";
import userSchema from "../schema/user.schema"
import { connection } from "mongoose";


@Module({
    imports:[MongooseModule.forFeature([{name:'User',schema:userSchema}])],
    controllers:[AuthController],
    providers:[AuthService],
})
export default class AuthModule{}