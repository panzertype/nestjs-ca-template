import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { UserEntity } from '../../domain/entities/user.entity';
import { UserValidationError } from '../../domain/errors/user-validation.error';
import { WeakPasswordError } from '../../domain/errors/weak-password.error';
import { Password } from '../../domain/value-objects/password.vo';
import { LoginUserDto } from '../dto/login-user.dto';
import { RegisterUserDto } from '../dto/register-user.dto';
import * as userRepository from '../ports/user.repository';

@Injectable()
export class UserService {
    constructor(
        @Inject(userRepository.UserRepositoryToken)
        private readonly userRepository: userRepository.IUserRepository
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<UserEntity> {
        try {
            const { username, email, password, birthday } = registerUserDto;

            const userExists = await this.userRepository.findByEmail(email);
            if (userExists) {
                throw new UserValidationError(`user with email ${email} already exists`);
            }

            const newPassword = await Password.fromPlain(password);
            const newUser = new UserEntity(randomUUID(), username, email, birthday, newPassword);

            return this.userRepository.save(newUser);
        } catch (error) {
            if (error instanceof UserValidationError || error instanceof WeakPasswordError) {
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }

    async login(loginUserDto: LoginUserDto): Promise<UserEntity> {
        try {
            const { email, password } = loginUserDto;

            const user = await this.userRepository.findByEmail(email);
            if (!user) throw new NotFoundException();

            const passwordMatches = await user.hasPassword(password);
            if (!passwordMatches) throw new NotFoundException();

            return user;
        } catch (error) {
            if (error instanceof UserValidationError) {
                throw new BadRequestException(error.message);
            }

            throw error;
        }
    }
}
