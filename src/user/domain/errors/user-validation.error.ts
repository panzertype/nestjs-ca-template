export class UserValidationError extends Error {
    constructor(message: string = 'User validation failed') {
        super(message);
        this.name = 'UserValidationError';
    }
}
