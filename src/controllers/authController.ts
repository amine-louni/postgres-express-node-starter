
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { cathAsync } from '../helpers/catchAsync';
import { User } from '../entities/User';

import { config } from 'dotenv'
import crypt from 'bcryptjs'
import AppError from "../helpers/AppError";
import { BAD_AUTH, VALIDATION_FAILED } from "../constatns";
import { validate } from "class-validator";
import formatValidationErrors from "../helpers/formatValidationErrors";
import EmailSender from "../helpers/EmailSender";

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
export const register = cathAsync(async (req, res, next) => {
    const {
        first_name,
        last_name,
        user_name,
        email,
        dob,
        password
    } = req.body

    // validate 

    // create user 
    const newUser = await User.create({
        first_name,
        last_name,
        user_name,
        email,
        dob,
        password
    })

    const errors = await validate(newUser);
    if (errors.length > 0) {

        next(new AppError('validationFailed', 400, VALIDATION_FAILED, formatValidationErrors(errors)))
        return;
    }
    await newUser.save();
    // const url = `${req.protocol}://${req.get('host')}/me`;

    try {
        await new EmailSender(newUser, '', '1342').sendValidationEmail();

    } catch (e) {
        console.log('error whiel sending emial')
        console.error(e)
    }
    createSendToken(newUser, 201, req, res);
    return;


});

export const login = cathAsync(async (req, res, next) => {
    const { email, password } = req.body;

    // 1 ) Check if email & password inputs exists
    if (!password || !email) {
        return next(new AppError('wrong login credeintials', 400, BAD_AUTH));
    }

    // 2 ) Check if user & password exits

    const newUser = await User.findOne({ email });


    if (!newUser || !(await crypt.compare(password, newUser?.password))) {
        return next(new AppError('wrong login credeintials', 401, BAD_AUTH));
    }


    // 3 ) Every thing is okay !
    createSendToken(newUser, 200, req, res);
});