class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    codeError: string;
    constructor(message: string, statusCode: number, codeError: string) {
        super(message);
        this.statusCode = statusCode;

        this.status = `${statusCode}`.startsWith('4') ? 'Fail' : 'Error';
        this.isOperational = true;
        this.codeError = codeError

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;