import { Module } from '@nestjs/common';
import { UserRepositoryToken } from './application/ports/user.repository';
import { UserService } from './application/services/user.service';
import { UserInMemoryRepository } from './infrastructure/adapters/user-in-memory.repository';
import { UserController } from './presentation/user.controller';

@Module({
    controllers: [UserController],
    providers: [
        UserService,
        {
            provide: UserRepositoryToken,
            useClass: UserInMemoryRepository,
        },
    ],
})
export class UserModule { }
