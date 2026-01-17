import { WeakPasswordError } from '../errors/weak-password.error';
import { Password } from './password.vo';

describe('Password Value Object', () => {
    describe('fromPlain', () => {
        it('should create a password from a plain string with strong password', async () => {
            const plainPassword = 'SecurePassword123!';

            const password = await Password.fromPlain(plainPassword);

            expect(password).toBeInstanceOf(Password);
            expect(password.getHash()).toBeTruthy();
            expect(password.getHash()).toContain(':');
        });

        it('should throw error for weak password without uppercase', async () => {
            const weakPassword = 'securepassword123!';

            await expect(Password.fromPlain(weakPassword)).rejects.toThrow(WeakPasswordError);
        });

        it('should throw error for weak password without lowercase', async () => {
            const weakPassword = 'SECUREPASSWORD123!';

            await expect(Password.fromPlain(weakPassword)).rejects.toThrow(WeakPasswordError);
        });

        it('should throw error for weak password without number', async () => {
            const weakPassword = 'SecurePassword!';

            await expect(Password.fromPlain(weakPassword)).rejects.toThrow(WeakPasswordError);
        });

        it('should throw error for weak password without special character', async () => {
            const weakPassword = 'SecurePassword123';

            await expect(Password.fromPlain(weakPassword)).rejects.toThrow(WeakPasswordError);
        });

        it('should throw error for weak password that is too short', async () => {
            const weakPassword = 'Pass1!';

            await expect(Password.fromPlain(weakPassword)).rejects.toThrow(WeakPasswordError);
        });

        it('should create different hashes for the same password', async () => {
            const plainPassword = 'SecurePassword123!';

            const password1 = await Password.fromPlain(plainPassword);
            const password2 = await Password.fromPlain(plainPassword);

            expect(password1.getHash()).not.toBe(password2.getHash());
        });
    });

    describe('fromHash', () => {
        it('should create a password object from a valid hash', async () => {
            const plainPassword = 'SecurePassword123!';
            const originalPassword = await Password.fromPlain(plainPassword);
            const hash = originalPassword.getHash();

            const password = Password.fromHash(hash);

            expect(password).toBeInstanceOf(Password);
        });

        it('should throw error for invalid hash format without colon', () => {
            const invalidHash = 'invalidehashnowithoutcolon';

            expect(() => Password.fromHash(invalidHash)).toThrow('Invalid hash format');
        });

        it('should throw error for invalid hash format with multiple parts', () => {
            const invalidHash = 'part1:part2:part3';

            expect(() => Password.fromHash(invalidHash)).toThrow('Invalid hash format');
        });
    });

    describe('equals', () => {
        it('should return true for correct password', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const result = await password.equals(plainPassword);

            expect(result).toBe(true);
        });

        it('should return false for incorrect password', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const result = await password.equals('WrongPassword123!');

            expect(result).toBe(false);
        });

        it('should return false for partially correct password', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const result = await password.equals('SecurePassword123');

            expect(result).toBe(false);
        });

        it('should handle comparison with empty string', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const result = await password.equals('');

            expect(result).toBe(false);
        });

        it('should be case sensitive', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const result = await password.equals('securepassword123!');

            expect(result).toBe(false);
        });
    });

    describe('getHash', () => {
        it('should return hash in format salt:hashedPassword', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);
            const hash = password.getHash();

            const parts = hash.split(':');

            expect(parts).toHaveLength(2);
            expect(parts[0]).toBeTruthy();
            expect(parts[1]).toBeTruthy();
        });

        it('should return consistent hash for same password object', async () => {
            const plainPassword = 'SecurePassword123!';
            const password = await Password.fromPlain(plainPassword);

            const hash1 = password.getHash();
            const hash2 = password.getHash();

            expect(hash1).toBe(hash2);
        });
    });

    describe('round-trip hash conversion', () => {
        it('should verify password after converting to and from hash', async () => {
            const plainPassword = 'SecurePassword123!';
            const originalPassword = await Password.fromPlain(plainPassword);
            const hash = originalPassword.getHash();

            const reconstructedPassword = Password.fromHash(hash);
            const result = await reconstructedPassword.equals(plainPassword);

            expect(result).toBe(true);
        });
    });
});
