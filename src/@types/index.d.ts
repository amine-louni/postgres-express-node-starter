import 'express';
import { IUser } from './user';

declare module 'express' {
    interface Request {
        user?: IUser;
        requestedTime?: string;
    }
}