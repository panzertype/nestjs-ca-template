import { UserValidationError } from '../errors/user-validation.error';
import { Password } from '../value-objects/password.vo';
import { UserEntity } from './user.entity';

describe('UserEntity', () => {
    let validPassword: Password;
    const validId = '550e8400-e29b-41d4-a716-446655440000';
    const validUsername = 'testuser';
    const validEmail = 'test@example.com';
    const validBirthday = '2000-01-15';

    beforeAll(async () => {
        validPassword = await Password.fromPlain('SecurePassword123!');
    });

    describe('constructor', () => {
        it('should create a valid user entity', () => {
            const user = new UserEntity(validId, validUsername, validEmail, validBirthday, validPassword);

            expect(user.id).toBe(validId);
            expect(user.username).toBe(validUsername);
            expect(user.email).toBe(validEmail);
            expect(user.birthday).toBe(validBirthday);
            expect(user.password).toBe(validPassword);
        });

        it('should throw error if id is not a valid UUID', () => {
            expect(() => {
                new UserEntity('invalid-id', validUsername, validEmail, validBirthday, validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity('invalid-id', validUsername, validEmail, validBirthday, validPassword);
            }).toThrow('id must be a uuid');
        });

        it('should throw error if username is too short', () => {
            expect(() => {
                new UserEntity(validId, 'ab', validEmail, validBirthday, validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity(validId, 'ab', validEmail, validBirthday, validPassword);
            }).toThrow('username must be between 3 and 50 characters');
        });

        it('should throw error if username is too long', () => {
            const longUsername = 'a'.repeat(51);
            expect(() => {
                new UserEntity(validId, longUsername, validEmail, validBirthday, validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity(validId, longUsername, validEmail, validBirthday, validPassword);
            }).toThrow('username must be between 3 and 50 characters');
        });

        it('should throw error if email is invalid', () => {
            expect(() => {
                new UserEntity(validId, validUsername, 'invalid-email', validBirthday, validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity(validId, validUsername, 'invalid-email', validBirthday, validPassword);
            }).toThrow('email must be a valid email');
        });

        it('should throw error if birthday is not a valid date string', () => {
            expect(() => {
                new UserEntity(validId, validUsername, validEmail, 'invalid-date', validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity(validId, validUsername, validEmail, 'invalid-date', validPassword);
            }).toThrow('birthday must be a date strng');
        });

        it('should throw error if user is too young (less than 6 years old)', () => {
            const today = new Date();
            const tooYoungBirthday = new Date(today.getFullYear() - 5, today.getMonth(), today.getDate())
                .toISOString()
                .split('T')[0];

            expect(() => {
                new UserEntity(validId, validUsername, validEmail, tooYoungBirthday, validPassword);
            }).toThrow(UserValidationError);
            expect(() => {
                new UserEntity(validId, validUsername, validEmail, tooYoungBirthday, validPassword);
            }).toThrow('age must be a positive number and more than 6');
        });
    });

    describe('isAdult', () => {
        it('should return true for users older than 18', () => {
            const adultBirthday = '2000-01-15';
            const user = new UserEntity(validId, validUsername, validEmail, adultBirthday, validPassword);

            expect(user.isAdult()).toBe(true);
        });

        it('should return false for users 18 or younger', () => {
            const today = new Date();
            const youngBirthday = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate())
                .toISOString()
                .split('T')[0];

            const user = new UserEntity(validId, validUsername, validEmail, youngBirthday, validPassword);

            expect(user.isAdult()).toBe(false);
        });
    });

    describe('isTeen', () => {
        it('should return true for users between 13 and 18', () => {
            const today = new Date();
            const teenBirthday = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())
                .toISOString()
                .split('T')[0];

            const user = new UserEntity(validId, validUsername, validEmail, teenBirthday, validPassword);

            expect(user.isTeen()).toBe(true);
        });

        it('should return false for adults', () => {
            const user = new UserEntity(validId, validUsername, validEmail, validBirthday, validPassword);

            expect(user.isTeen()).toBe(false);
        });

        it('should return false for users 13 or younger', () => {
            const today = new Date();
            const youngBirthday = new Date(today.getFullYear() - 12, today.getMonth(), today.getDate())
                .toISOString()
                .split('T')[0];

            const user = new UserEntity(validId, validUsername, validEmail, youngBirthday, validPassword);

            expect(user.isTeen()).toBe(false);
        });
    });

    describe('isBirthdayToday', () => {
        it('should return true if birthday is today', () => {
            const today = new Date();
            const birthdayToday = `${today.getFullYear() - 20}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

            const user = new UserEntity(validId, validUsername, validEmail, birthdayToday, validPassword);

            expect(user.isBirthdayToday()).toBe(true);
        });

        it('should return false if birthday is not today', () => {
            const user = new UserEntity(validId, validUsername, validEmail, validBirthday, validPassword);

            expect(user.isBirthdayToday()).toBe(false);
        });
    });

    describe('hasPassword', () => {
        it('should return true for correct password', async () => {
            const user = new UserEntity(validId, validUsername, validEmail, validBirthday, validPassword);

            const result = await user.hasPassword('SecurePassword123!');

            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const user = new UserEntity(validId, validUsername, validEmail, validBirthday, validPassword);

            const result = await user.hasPassword('WrongPassword123!');

            expect(result).toBe(false);
        });
    });
});
