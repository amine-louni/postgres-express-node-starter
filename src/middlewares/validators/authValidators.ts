import { check, validationResult } from 'express-validator';

import { Request, Response, NextFunction } from 'express'
import AppError from '../../helpers/AppError';
import { VALIDATION_FAILED } from '../../constatns';

export const updatePasswordValidator = [
    check('current_password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('current_password can not be empty!')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Minimum 5 characters required!')
        .bail(),
    check('password')
        .trim()
        .escape()
        .not()
        .isEmpty()
        .withMessage('password can not be empty!')
        .bail()
        .isLength({ min: 5 })
        .withMessage('Minimum 5 characters required!')
        .bail(),
    (req: Request, _res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())

            return next(new AppError('validation  error', 422, VALIDATION_FAILED, errors.array()))
        return next()

    },
];