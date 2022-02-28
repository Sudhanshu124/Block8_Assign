
import {Controller, Delete, Get, Param, Put,Body} from "@nestjs/common"
import UserService from "./user.service";
import {updateUserBody} from "../schema/user.schema"

@Controller("api/users")
export default class UserController{
    constructor(private readonly userService: UserService){}

    @Get()
    async getAllUsers(){
        return await this.userService.getAllUsers();
    }

    @Get("/:id")
    async getUser(@Param("id") id:string){
        return await this.userService.getUser(id);
    }

    @Delete("/:id")
    async deleteUser(@Param("id") id:string){
        return await this.userService.deleteUser(id);
    }

    @Put("/:id")
    async updateUser(@Param("id") id:string,@Body() body:updateUserBody){
        return await this.userService.updateUser(id,body);
    }
    
}