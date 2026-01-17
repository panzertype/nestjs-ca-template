import { isDateString, isEmail, isInt, isUUID, maxLength, minLength } from 'class-validator';
import { UserValidationError } from '../errors/user-validation.error';
import { Password } from '../value-objects/password.vo';

export class UserEntity {
    private readonly age: number;

    constructor(
        readonly id: string,
        readonly username: string,
        readonly email: string,
        readonly birthday: string,
        readonly password: Password,
    ) {
        if (!isUUID(id)) {
            throw new UserValidationError('id must be a uuid');
        }
        if (!minLength(username, 3) || !maxLength(username, 50)) {
            throw new UserValidationError('username must be between 3 and 50 characters');
        }
        if (!isEmail(email)) {
            throw new UserValidationError('email must be a valid email');
        }
        if (!isDateString(birthday)) {
            throw new UserValidationError('birthday must be a date strng');
        }

        this.age = this.getAge(birthday);
        if (!isInt(this.age) || this.age < 6) {
            throw new UserValidationError('age must be a positive number and more than 6');
        }
    }

    private getAge(birthday: string): number {
        const birthDate = new Date(birthday);
        const today = new Date();
        const calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const hasHadBirthdayThisYear = today.getMonth() > birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
        return hasHadBirthdayThisYear ? calculatedAge : calculatedAge - 1;
    }

    isTeen(): boolean {
        return this.age > 13 && !this.isAdult();
    }

    isAdult(): boolean {
        return this.age > 18;
    }

    isBirthdayToday(): boolean {
        const today = new Date();
        const birthDate = new Date(this.birthday);
        return today.getMonth() === birthDate.getMonth() && today.getDate() === birthDate.getDate();
    }

    async hasPassword(plainPassword: string): Promise<boolean> {
        return this.password.equals(plainPassword);
    }
}
