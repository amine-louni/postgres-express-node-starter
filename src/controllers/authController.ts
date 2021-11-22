
import { Request, Response } from "express";
import jwt from 'jsonwebtoken'

import { cathAsync } from '../helpers/catchAsync';
import { User } from '../entities/User';

import { config } from 'dotenv'
import crypt from 'bcryptjs'
import AppError from "../helpers/AppError";
import { ALLOWED_USER_FIELDS, BAD_AUTH, BAD_INPUT, EMAIL_ALREADY_VALIDATED, SECRET_USER_FIELDS, VALIDATION_EMAIL_PIN_EXPIRED, VALIDATION_FAILED } from "../constatns";
import { validate } from "class-validator";
import formatValidationErrors from "../helpers/formatValidationErrors";
import { IUser } from "src/@types/user";


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

const createSendToken = async (user: IUser, status: number, req: Request, res: Response) => {

    const token = singingToken(user.uuid);
    res.cookie('jwt', token, {
        expires: new Date(
            Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
        ),
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        httpOnly: true,
    });

    // remove sensetive data
    SECRET_USER_FIELDS.forEach((secretField) => {
        user[secretField] = undefined;
    })


    res.status(status).json({
        status: 'success',
        token,
        data: {
            ...user,
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

    const theUser = await User.findOne({
        select: [...ALLOWED_USER_FIELDS, 'password'],
        where: {
            email: email
        },


    });


    if (!theUser || !(await crypt.compare(password, theUser?.password))) {
        return next(new AppError('wrong login credeintials', 401, BAD_AUTH));
    }


    // 3 ) Every thing is okay !
    createSendToken(theUser, 200, req, res);
});


export const validateEmail = cathAsync(async (req, res, next) => {
    const { pin, user_name } = req.body;


    // 1 ) Check if email & password inputs exists
    if (!pin || !user_name) {
        return next(new AppError('wrong validation pin', 422, BAD_INPUT));
    }


    // 2 ) Check if user exits
    const theUser = await User.findOne({ user_name });


    // 5 )  Check if the user is not email validated yet
    console.log(theUser)
    console.log(theUser?.email_validate_at)
    if (theUser?.email_validate_at) {
        return next(new AppError('wrong validation pin', 422, EMAIL_ALREADY_VALIDATED));
    }

    // 4 ) Check the correctness
    if (!theUser || !(await crypt.compare(pin, theUser?.email_validation_pin))) {
        return next(new AppError('wrong validation pin', 422, BAD_INPUT));

    }


    // 4 ) Check if the pin still valid ⏲️

    if (new Date() > theUser.email_validation_pin_expires_at) {
        console.log('passed')
        return next(new AppError('validation key expired', 422, VALIDATION_EMAIL_PIN_EXPIRED));

    }

    // return res.json({
    //     status: 'testign yo'
    // })
    //  3 )  validate the email 👌

    const updatedUser = User.update(theUser.uuid, {
        email_validation_pin: undefined,
        email_validation_pin_expires_at: undefined,
        email_validate_at: new Date()

    })


    res.status(201).json({
        user: updatedUser
    })

})