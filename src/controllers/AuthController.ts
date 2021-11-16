
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { cathAsync } from '../helpers/catchAsync';
import { User } from '../entities/User';

import { config } from 'dotenv'

config()

const singingToken = (id: string): string => {
    return jwt.sign(
        {
            id,
        },
        process.env.JWT_SECRET_KEY,
        { expiresIn: process.env.JWT_EXPIRED_IN }
    );
};

const createSendToken = async (user: any, status: number, req: Request, res: Response) => {

    const token = singingToken(user.id);
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
        ),
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        httpOnly: true,
    });

    // just remove password from the response
    user.password = undefined;

    res.status(status).json({
        status: 'success',
        token,
        data: {
            user,
        },
    });
};

// @ Todo
// Send verification email 
export const register = cathAsync(async (req, res) => {


    const {
        first_name,
        last_name,
        user_name,
        email,
        dob,
        password
    } = req.body

    // create user 
    const newUser = await User.create({
        first_name,
        last_name,
        user_name,
        email,
        dob,
        password
    }).save();



    createSendToken(newUser, 201, req, res);
});
