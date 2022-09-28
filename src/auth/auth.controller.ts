import {Body, Controller, Get, Post, UseGuards} from '@nestjs/common';
import {AuthService} from './auth.service';
import {signIn, signUp} from "./dto/auth.dto";
import {JwtAuthGuard} from "./jwt.authGuard";
import {CurrentUser} from "./currentUser.decorator";
import {UserEntity} from "../db/entities/users.entity";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
    }

    @Post('register')
    async userSignup(
        @Body() payload: signUp,
    ): Promise<{ message: string }> {
        return this.authService.createUser(payload);
    }


    @Post('login')
    async loginUser(@Body() payload: signIn): Promise<{ message: string }> {
        return this.authService.loginUser(payload)
    }

    @UseGuards(JwtAuthGuard)
    @Get('currentUser')
    async getCurrentUserData(
        @CurrentUser() currentUser: UserEntity,
    ): Promise<{ message: string }>  {
        return this.authService.getCurrentUser(currentUser);
    }
}
