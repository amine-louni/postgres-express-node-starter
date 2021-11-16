class AppError extends Error {
    statusCode: number;
    status: string;
    isOperational: boolean;
    code: string;
    constructor(message: string, statusCode: number, code: string) {
        super(message);
        this.statusCode = statusCode;

        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;
        this.code = code

        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;