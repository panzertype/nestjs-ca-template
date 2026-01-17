import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
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
}
