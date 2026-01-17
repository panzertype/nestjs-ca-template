import { UserEntity } from '../../domain/entities/user.entity';

export interface IUserRepository {
    save(user: UserEntity): Promise<UserEntity>;
    findById(id: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    findAll(): Promise<UserEntity[]>;
    delete(id: string): Promise<void>;
}

export const UserRepositoryToken = Symbol('IUserRepository');