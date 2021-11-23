import 'express';
import { User } from 'src/entities/User';


declare module 'express' {
    interface Request {
        currentUser?: User;
        requestedTime?: string;
    }
}