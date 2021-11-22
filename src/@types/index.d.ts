import 'express';
import { IUser } from './user';

declare module 'express' {
    interface Request {
        currentUser?: IUser;
        requestedTime?: string;
    }
}