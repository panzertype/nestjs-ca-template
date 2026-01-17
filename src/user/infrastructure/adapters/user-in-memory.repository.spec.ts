import { UserEntity } from '../../domain/entities/user.entity';
import { Password } from '../../domain/value-objects/password.vo';
import { UserInMemoryRepository } from './user-in-memory.repository';

describe('UserInMemoryRepository', () => {
    let repository: UserInMemoryRepository;
    let validPassword: Password;
    const validId1 = '550e8400-e29b-41d4-a716-446655440001';
    const validId2 = '550e8400-e29b-41d4-a716-446655440002';
    const validId3 = '550e8400-e29b-41d4-a716-446655440003';

    beforeAll(async () => {
        validPassword = await Password.fromPlain('SecurePassword123!');
    });

    beforeEach(() => {
        repository = new UserInMemoryRepository();
    });

    describe('save', () => {
        it('should save a user to the repository', async () => {
            const user = new UserEntity(validId1, 'testuser', 'test@example.com', '2000-01-15', validPassword);

            const savedUser = await repository.save(user);

            expect(savedUser).toEqual(user);
        });

        it('should return the saved user', async () => {
            const user = new UserEntity(validId1, 'testuser', 'test@example.com', '2000-01-15', validPassword);

            const result = await repository.save(user);

            expect(result.id).toBe(validId1);
            expect(result.username).toBe('testuser');
            expect(result.email).toBe('test@example.com');
        });

        it('should overwrite an existing user with the same id', async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId1, 'user2', 'user2@example.com', '2000-01-15', validPassword);

            await repository.save(user1);
            const result = await repository.save(user2);

            expect(result.username).toBe('user2');
            expect(result.email).toBe('user2@example.com');
        });

        it('should allow saving multiple users', async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);

            await repository.save(user1);
            await repository.save(user2);

            const users = await repository.findAll();
            expect(users).toHaveLength(2);
        });
    });

    describe('findById', () => {
        beforeEach(async () => {
            const user = new UserEntity(validId1, 'testuser', 'test@example.com', '2000-01-15', validPassword);
            await repository.save(user);
        });

        it('should find a user by id', async () => {
            const result = await repository.findById(validId1);

            expect(result).not.toBeNull();
            expect(result?.username).toBe('testuser');
        });

        it('should return null if user not found', async () => {
            const result = await repository.findById(validId2);

            expect(result).toBeNull();
        });

        it('should find the correct user', async () => {
            const user = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);
            await repository.save(user);

            const result = await repository.findById(validId2);

            expect(result?.username).toBe('user2');
        });
    });

    describe('findByEmail', () => {
        beforeEach(async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);
            await repository.save(user1);
            await repository.save(user2);
        });

        it('should find a user by email', async () => {
            const result = await repository.findByEmail('user1@example.com');

            expect(result).not.toBeNull();
            expect(result?.username).toBe('user1');
        });

        it('should return null if user not found', async () => {
            const result = await repository.findByEmail('nonexistent@example.com');

            expect(result).toBeNull();
        });

        it('should return the correct user for the email', async () => {
            const result = await repository.findByEmail('user2@example.com');

            expect(result?.id).toBe(validId2);
            expect(result?.username).toBe('user2');
        });

        it('should be case-sensitive for email search', async () => {
            const result = await repository.findByEmail('USER1@EXAMPLE.COM');

            expect(result).toBeNull();
        });

        it('should handle finding when multiple users exist', async () => {
            const user3 = new UserEntity(validId3, 'user3', 'user3@example.com', '2000-01-15', validPassword);
            await repository.save(user3);

            const result = await repository.findByEmail('user2@example.com');

            expect(result?.id).toBe(validId2);
        });
    });

    describe('findAll', () => {
        it('should return empty array when no users exist', async () => {
            const result = await repository.findAll();

            expect(result).toEqual([]);
        });

        it('should return all saved users', async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);
            const user3 = new UserEntity(validId3, 'user3', 'user3@example.com', '2000-01-15', validPassword);

            await repository.save(user1);
            await repository.save(user2);
            await repository.save(user3);

            const result = await repository.findAll();

            expect(result).toHaveLength(3);
        });

        it('should return the correct users', async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);

            await repository.save(user1);
            await repository.save(user2);

            const result = await repository.findAll();

            expect(result).toContainEqual(user1);
            expect(result).toContainEqual(user2);
        });

        it('should return new array each time', async () => {
            const user = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            await repository.save(user);

            const result1 = await repository.findAll();
            const result2 = await repository.findAll();

            expect(result1).not.toBe(result2);
            expect(result1).toEqual(result2);
        });
    });

    describe('delete', () => {
        beforeEach(async () => {
            const user1 = new UserEntity(validId1, 'user1', 'user1@example.com', '2000-01-15', validPassword);
            const user2 = new UserEntity(validId2, 'user2', 'user2@example.com', '2000-01-15', validPassword);
            await repository.save(user1);
            await repository.save(user2);
        });

        it('should delete a user by id', async () => {
            await repository.delete(validId1);

            const result = await repository.findAll();

            expect(result).toHaveLength(1);
        });

        it('should remove the correct user', async () => {
            await repository.delete(validId1);

            const result = await repository.findByEmail('user1@example.com');

            expect(result).toBeNull();
        });

        it('should not affect other users', async () => {
            await repository.delete(validId1);

            const result = await repository.findByEmail('user2@example.com');

            expect(result).not.toBeNull();
            expect(result?.username).toBe('user2');
        });

        it('should handle deleting non-existent user', async () => {
            expect(() => repository.delete(validId3)).not.toThrow();
        });

        it('should allow finding deleted user returns null', async () => {
            await repository.delete(validId1);

            const result = await repository.findById(validId1);

            expect(result).toBeNull();
        });
    });
});
