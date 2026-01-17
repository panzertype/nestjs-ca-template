export class WeakPasswordError extends Error {
    constructor(message: string = 'Weak password error') {
        super(message);
        this.name = 'WeakPasswordError';
    }
}
