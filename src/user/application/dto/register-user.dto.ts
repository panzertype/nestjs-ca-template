import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class RegisterUserDto {
    @ApiProperty({
        type: 'string',
        description: 'Username',
    })
    @IsString()
    username: string;

    @ApiProperty({
        type: 'string',
        description: 'User email address',
    })
    @IsString()
    email: string;

    @ApiProperty({
        type: 'string',
        description: 'User password',
    })
    @IsString()
    password: string;

    @ApiProperty({
        type: 'string',
        description: 'User birthday timestamp',
    })
    @IsString()
    birthday: string;
}
