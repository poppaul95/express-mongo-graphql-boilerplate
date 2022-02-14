import { ApolloError } from 'apollo-server-errors';
import { Log } from '@utils/logger';

const ErrorTypes = {
    notFound: 'OBJECT_NOT_FOUND',
    invalidUsernamePassword: 'INVALID_USERNAME_PASSWORD',
    duplicateUsername: 'DUPLICATE_EMAIL',
    internalError: 'INTERNAL_SERVER_ERROR'
} as const;

type valueOf<T> = T[keyof T]

class CustomError extends ApolloError {
    constructor(message: string, type: valueOf<typeof ErrorTypes>) {
        super(message, type);
        Log.error(message)
        Object.defineProperty(this, 'name', { value: type });
    }
}

export { CustomError, ErrorTypes }