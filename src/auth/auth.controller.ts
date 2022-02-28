import { Body, Controller, Get, Post } from '@nestjs/common';
import AuthService  from './auth.service';
import {registerBody,loginBody} from "../schema/user.schema";

@Controller('api/auth')
export default class AuthController {

    constructor(private authService: AuthService){}
  
    //Register Controller-----------------
    @Post('register')
    async register(@Body() body:registerBody){
        return await this.authService.register(body);
    }

    //Login Controller-------------------
    @Post('login')
    async login(@Body() body:loginBody){
        return await this.authService.login(body);
    }
}

