import { isStrongPassword } from 'class-validator';
import { randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { WeakPasswordError } from '../errors/weak-password.error';

const scryptAsync = promisify(scrypt);

export class Password {
    private constructor(
        private readonly hashedPassword: string,
        private readonly salt: string
    ) { }

    static async fromPlain(plainPassword: string): Promise<Password> {
        if (!isStrongPassword(plainPassword)) {
            throw new WeakPasswordError('Password must be strong (at least 8 characters, 1 uppercase, 1 lowercase, 1 number, 1 special character)');
        }
        const salt = randomBytes(16).toString('hex');
        const derivedKey = await scryptAsync(plainPassword, salt, 64) as Buffer;
        const hashedPassword = derivedKey.toString('hex');
        return new Password(hashedPassword, salt);
    }

    static fromHash(hash: string): Password {
        const parts = hash.split(':');
        if (parts.length !== 2) {
            throw new Error('Invalid hash format');
        }
        const [salt, hashedPassword] = parts;
        return new Password(hashedPassword, salt);
    }

    async equals(plainPassword: string): Promise<boolean> {
        try {
            const derivedKey = await scryptAsync(plainPassword, this.salt, 64) as Buffer;
            const hashBuffer = Buffer.from(this.hashedPassword, 'hex');
            return timingSafeEqual(derivedKey, hashBuffer);
        } catch {
            return false;
        }
    }

    getHash(): string {
        return `${this.salt}:${this.hashedPassword}`;
    }
}
