import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { LoginUserResponseDto } from '../application/dto/login-user-response.dto';
import { LoginUserDto } from '../application/dto/login-user.dto';
import { RegisterUserResponseDto } from '../application/dto/register-user-response.dto';
import { RegisterUserDto } from '../application/dto/register-user.dto';
import { UserService } from '../application/services/user.service';

@Controller('api/user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post('register')
    @ApiResponse({
        status: 201,
        description: 'User registered successfully',
        type: RegisterUserResponseDto,
    })
    async register(@Body() registerUserDto: RegisterUserDto): Promise<RegisterUserResponseDto> {
        const user = await this.userService.register(registerUserDto);
        return new RegisterUserResponseDto(user.id, user.username, user.email, user.birthday);
    }

    @Post('login')
    @HttpCode(200)
    @ApiResponse({
        status: 200,
        description: 'User logged in successfully',
        type: LoginUserResponseDto,
    })
    async login(@Body() loginUserDto: LoginUserDto): Promise<LoginUserResponseDto> {
        const user = await this.userService.login(loginUserDto);
        return new LoginUserResponseDto(user.id, user.username, user.email, user.birthday);
    }
}
