import AppError from '../helpers/AppError'
import { Request, Response } from "express";
import { EXPIRED_TOKEN, INVALID_TOKEN, __prod__ } from '../constatns';




const handleJWTError = () =>
    new AppError('Invalid token. Please log in again!', 401, INVALID_TOKEN);

const handleJWTExpiredError = () =>
    new AppError('Your token has expired! Please log in again.', 401, EXPIRED_TOKEN);

const sendErrorDev = (err: any, req: Request, res: Response) => {

    // A) API 
    if (req.originalUrl.startsWith('/api')) {
        return res.status(err.statusCode).json({
            status: err.status,
            error: err,
            message: err.message,
            stack: err.stack,
        });
    }

    // B) RENDERED WEBSITE
    console.error('ERROR 💥', err);
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: err.message,
    });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
    // A) API
    if (req.originalUrl.startsWith('/api')) {
        // A) Operational, trusted error: send message to client
        if (err.isOperational) {
            return res.status(err.statusCode).json({
                status: err.status,
                message: err.message,
            });
        }
        // B) Programming or other unknown error: don't leak error details
        // 1) Log error
        console.error('ERROR 💥', err);
        // 2) Send generic message
        return res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }

    // B) RENDERED WEBSITE
    // A) Operational, trusted error: send message to client
    if (err.isOperational) {
        return res.status(err.statusCode).render('error', {
            title: 'Something went wrong!',
            msg: err.message,
        });
    }
    // B) Programming or other unknown error: don't leak error details
    // 1) Log error
    console.error('ERROR 💥', err);
    // 2) Send generic message
    return res.status(err.statusCode).render('error', {
        title: 'Something went wrong!',
        msg: 'Please try again later.',
    });
};

export default (err: any, req: Request, res: Response) => {
    // console.log(err.stack);

    console.log('global error handler')
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    if (!__prod__) {
        sendErrorDev(err, req, res);
    } else if (__prod__) {
        let error = { ...err };
        error.message = err.message;




        if (error.name === 'JsonWebTokenError') error = handleJWTError();
        if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

        sendErrorProd(error, req, res);
    }
};
