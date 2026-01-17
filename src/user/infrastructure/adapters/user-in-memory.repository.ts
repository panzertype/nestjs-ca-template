import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../application/ports/user.repository';
import { UserEntity } from '../../domain/entities/user.entity';

@Injectable()
export class UserInMemoryRepository implements IUserRepository {
    private users: Map<string, UserEntity> = new Map();

    async save(user: UserEntity): Promise<UserEntity> {
        this.users.set(user.id, user);
        return user;
    }

    async findById(id: string): Promise<UserEntity | null> {
        return this.users.get(id) || null;
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        for (const user of this.users.values()) {
            if (user.email === email) {
                return user;
            }
        }
        return null;
    }

    async findAll(): Promise<UserEntity[]> {
        return Array.from(this.users.values());
    }

    async delete(id: string): Promise<void> {
        this.users.delete(id);
    }
}
