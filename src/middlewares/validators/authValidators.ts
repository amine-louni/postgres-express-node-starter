import { body, check, validationResult } from "express-validator";

import { Request, Response, NextFunction } from "express";
import AppError from "../../helpers/AppError";
import { passwordRegExValidator, VALIDATION_FAILED } from "../../constatns";

export const userRegisterValidator = [
  check("first_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("first_name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail()
    .isAlpha()
    .withMessage("must contain only alphabets"),
  check("last_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("last_name can not be empty!")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail()
    .isAlpha()
    .withMessage("must contain only alphabets"),
  check("user_name")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("user_name can not be empty!")
    .bail()
    .isAlphanumeric()
    .withMessage("user name must contain alphabets and numbers only")
    .bail()
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!")
    .bail(),
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("invalid email formt")
    .bail(),
  check("dob")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("last_name can not be empty!")
    .bail()
    .isDate()
    .withMessage("dob must be in valid format! ex : 10-10-1900")
    .bail(),

  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("password can not be empty!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .matches(passwordRegExValidator)
    .withMessage("Minimum eight characters, at least one letter and one number")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];

export const userLoginValidator = [
  check("user_name")
    .if(body("email").isEmpty() && body("user_name").exists())
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("user_name can not be empty!")
    .bail()
    .isAlphanumeric()
    .withMessage("user name must contain alphabets and numbers only")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail(),
  check("email")
    .if(body("user_name").isEmpty())
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("invalid email formt")
    .bail(),

  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("password can not be empty!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .matches(passwordRegExValidator)
    .withMessage("Minimum eight characters, at least one letter and one number")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];

export const updatePasswordValidator = [
  check("current_password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("current_password can not be empty!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .matches(passwordRegExValidator)
    .withMessage("Minimum eight characters, at least one letter and one number")
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("password can not be empty!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .matches(passwordRegExValidator)
    .withMessage("Minimum eight characters, at least one letter and one number")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];
export const updateEmailValidator = [

  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("invalid email format")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];

export const userValidateEmailValidator = [
  check("pin")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("pin can not be empty!")
    .bail()
    .isAlphanumeric()
    .withMessage("pin must contain alphabets and numbers only")
    .bail()
    .isLength({ max: 8, min: 8 })
    .withMessage("Pin must be 8 characters!")
    .bail(),

  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];

export const userForgotPassword = [
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("invalid email formt")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];

export const userResetPassword = [
  check("pin")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("pin can not be empty!")
    .bail()
    .isAlphanumeric()
    .withMessage("pin must contain alphabets and numbers only")
    .bail()
    .isLength({ max: 8, min: 8 })
    .withMessage("Pin must be 8 characters!")
    .bail(),
  check("email")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("email can not be empty!")
    .bail()
    .isEmail()
    .withMessage("invalid email formt")
    .bail(),
  check("password")
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage("password can not be empty!")
    .bail()
    .isLength({ min: 5 })
    .withMessage("Minimum 5 characters required!")
    .bail()
    .matches(passwordRegExValidator)
    .withMessage("Minimum eight characters, at least one letter and one number")
    .bail(),
  (req: Request, _res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return next(
        new AppError(
          "validation  error",
          422,
          VALIDATION_FAILED,
          errors.array()
        )
      );
    return next();
  },
];
