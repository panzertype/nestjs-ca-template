import { ApiProperty } from '@nestjs/swagger';

export class LoginUserResponseDto {
    @ApiProperty({
        type: 'string',
        description: 'User ID',
    })
    id: string;

    @ApiProperty({
        type: 'string',
        description: 'Username',
    })
    username: string;

    @ApiProperty({
        type: 'string',
        description: 'User email address',
    })
    email: string;

    @ApiProperty({
        type: 'string',
        description: 'User birthday',
    })
    birthday: string;

    constructor(id: string, username: string, email: string, birthday: string) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.birthday = birthday;
    }
}
