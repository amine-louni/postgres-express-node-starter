
import express, { Request, Response, NextFunction } from 'express'
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import userRoutes from './routes/userRoutes'
import { __prod__ } from './constatns';
import AppError from './helpers/AppError'



const app = express();

// Get the Auth service for the default app

app.enable('trust proxy');

//GLOBALS MIDDLEWARES

// implement CORS (Access-Control-Allow-Origin *)
app.use(cors());
// Set security http headers
app.use(helmet());

// Development logging
if (!__prod__) {
    app.use(morgan('dev'));
}

// Body parser, reading data from the body to req.body
app.use(
    express.json({
        limit: '10kb',
    })
);

// Test middleware
app.use((req: Request, _res: Response, next: NextFunction) => {
    req.requestedTime = new Date().toISOString();

    next();
});

// MOUNTING  ROUTERS
app.use('/api/v1/users', userRoutes);

//Error Handling (if the route is not  of the previous ones (not found))
app.all('*', (req, _res, next) => {
    // Passing The error to the globalError Handler
    next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
});

// @Todoo Global error handling



export default app;



