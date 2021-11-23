import { ValidationError } from 'express-validator';

class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    code: [string] | string;
    errors?: { field: string, code: string, description: string }[] | ValidationError[] | []
    constructor(message: string, statusCode: number, code: [string] | string = 'uknown_error', errors: { field: string, code: string, description: string }[] | ValidationError[] | [] = []) {
        super(message);
        this.statusCode = statusCode;

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.code = code
        if (errors && errors.length > 0) {
            this.errors = errors;
        }

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;