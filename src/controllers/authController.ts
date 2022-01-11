import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import jwt_decode from "jwt-decode";
import crypto from "crypto";

import { cathAsync } from "../helpers/catchAsync";
import { User } from "../entities/User";

import crypt from "bcryptjs";
import AppError from "../helpers/AppError";
import {
  ALLOWED_USER_FIELDS,
  BAD_AUTH,
  BAD_INPUT,
  EMAIL_ALREADY_VALIDATED,
  EMAIL_PIN_EXPIRATION_IN_MINUTES,
  NOT_FOUND,
  PASSWORD_RESET_PIN_EXPIRED,
  SECRET_USER_FIELDS,
  SERVER_ERROR,
  VALIDATION_EMAIL_PIN_EXPIRED,
  VALIDATION_FAILED,
} from "../constatns";
import { validate } from "class-validator";
import formatValidationErrors from "../helpers/formatValidationErrors";
import changedPasswordAfter from "../helpers/changedPasswordAfter";
import EmailSender from "../helpers/EmailSender";

export const filterobj = (objToFilter: any, itemsToFilterOut: string[]) => {
  itemsToFilterOut.forEach((secretField) => {
    delete objToFilter[secretField];
  });
};

const singingToken = (id: string): string => {
  return jwt.sign(
    {
      id,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRED_IN }
  );
};

const createSendToken = async (
  user: User,
  status: number,
  req: Request,
  res: Response
) => {
  const token = singingToken(user.uuid);
  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRED_IN * 24 * 60 * 60 * 1000
    ),
    secure: req.secure || req.headers["x-forwarded-proto"] === "https",
    httpOnly: true,
  });

  // remove sensetive data
  filterobj(user, [...SECRET_USER_FIELDS]);

  res.status(status).json({
    status: "success",
    token,
    data: {
      ...user,
    },
  });
};

export const register = cathAsync(async (req, res, next) => {
  const { first_name, last_name, user_name, email, dob, password } = req.body;

  // create user
  const newUser = await User.create({
    first_name,
    last_name,
    user_name,
    email,
    dob,
    password,
  });

  const errors = await validate(newUser);
  if (errors.length > 0) {
    next(
      new AppError(
        "validationFailed",
        400,
        VALIDATION_FAILED,
        formatValidationErrors(errors)
      )
    );
    return;
  }
  await newUser.save();
  // const url = `${req.protocol}://${req.get('host')}/me`;

  createSendToken(newUser, 201, req, res);
  return;
});

export const login = cathAsync(async (req, res, next) => {
  const { email, password, user_name } = req.body;

  // 2 ) Check if user & password exits

  const theUser = await User.findOne({
    select: [...ALLOWED_USER_FIELDS, "password"],
    where: {
      ...(user_name && { user_name: user_name }),
      ...(email && { email: email }),
    },
  });

  if (!theUser || !(await crypt.compare(password, theUser?.password))) {
    return next(new AppError("wrong login credeintials", 401, BAD_AUTH));
  }

  // 3 ) Every thing is okay !
  createSendToken(theUser, 200, req, res);
});

export const validateEmail = cathAsync(async (req, res, next) => {
  const { pin } = req.body;

  // 2 ) Check if user exits
  const theUser = await User.findOne({
    select: [
      ...ALLOWED_USER_FIELDS,
      "password",
      "email_validation_pin",
      "email_validation_pin_expires_at",
    ],
    where: {
      uuid: req.currentUser?.uuid,
    },
  });

  // 3)  Check if the user is not email validated yet

  if (theUser?.email_validate_at) {
    return next(
      new AppError("wrong validation pin", 422, EMAIL_ALREADY_VALIDATED)
    );
  }

  // 4 ) Check the correctness
  if (
    !theUser ||
    !theUser?.email_validation_pin ||
    !(await crypt.compare(pin, theUser?.email_validation_pin))
  ) {
    return next(new AppError("wrong validation pin", 422, BAD_INPUT));
  }

  // 4 ) Check if the pin still valid ⏲️

  if (
    theUser.email_validation_pin_expires_at &&
    new Date() > theUser.email_validation_pin_expires_at
  ) {
    return next(
      new AppError("validation key expired", 422, VALIDATION_EMAIL_PIN_EXPIRED)
    );
  }

  // return res.json({
  //     status: 'testign yo'
  // })
  //  3 )  validate the email 👌

  const updatedUser = User.update(theUser.uuid, {
    email_validation_pin: undefined,
    email_validation_pin_expires_at: undefined,
    email_validate_at: new Date(),
  });

  res.status(201).json({
    user: updatedUser,
  });
});

export const forgotPassword = cathAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const theUser = await User.findOne({ email: req.body.email });
  if (!theUser) {
    return next(new AppError("user not found", 404, NOT_FOUND));
  }

  // 2) Generate the random reset token
  await theUser.createAndSendPasswordResetPin().catch((e) => {
    return next(
      new AppError(
        `There was an error sending the email : ${e}`,
        500,
        SERVER_ERROR
      )
    );
  });

  res.status(201).json({
    status: "success",
    message: `email sent to ${theUser.email}`,
  });
});

export const resetPassword = cathAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const { pin, email, password } = req.body;

  const theUser = await User.findOne({
    select: [
      ...ALLOWED_USER_FIELDS,
      "password_reset_pin",
      "password_reset_pin_expires_at",
    ],
    where: {
      email,
    },
  });

  if (!theUser) {
    return next(new AppError("user not found", 404, NOT_FOUND));
  }

  // 2)  Check if the user is not email validated yet

  if (!theUser?.password_reset_pin) {
    return next(
      new AppError(
        "this user didn't requests to reset the password",
        422,
        BAD_INPUT
      )
    );
  }

  // 3 ) Check the correctness
  if (
    !theUser ||
    !theUser?.password_reset_pin ||
    !(await crypt.compare(pin, theUser?.password_reset_pin))
  ) {
    return next(new AppError("wrong validation pin", 422, BAD_INPUT));
  }

  // 4 ) Check if the pin still valid ⏲️

  if (
    theUser.password_reset_pin_expires_at &&
    new Date() > theUser.password_reset_pin_expires_at
  ) {
    return next(
      new AppError("validation key expired", 422, PASSWORD_RESET_PIN_EXPIRED)
    );
  }

  const hashed_password = await crypt.hash(password, 12);

  const updatedUser = User.update(theUser.uuid, {
    password: hashed_password,
    password_reset_pin: undefined,
    password_reset_pin_expires_at: undefined,
    password_changed_at: new Date(),
  });

  res.status(201).json({
    user: updatedUser,
  });
});

export const updatePassword = cathAsync(async (req, res, next) => {
  const { password, current_password } = req.body;

  // 1) Get user from collection
  const theUser = await User.findOne({
    select: [...ALLOWED_USER_FIELDS, "password"],
    where: {
      uuid: req.currentUser?.uuid,
    },
  });

  // 2) Check if POSTed current password is correct
  if (!theUser || !(await crypt.compare(current_password, theUser?.password))) {
    return next(new AppError("wrong login credeintials", 401, BAD_AUTH));
  }

  // 3) If so, update password

  await User.update(
    { uuid: theUser.uuid },
    {
      password: await crypt.hash(password, 12),
    }
  ).catch((e) =>
    next(
      new AppError(`error while updating the password ${e}`, 500, SERVER_ERROR)
    )
  );

  const updatedUser = await User.findOne({ uuid: theUser.uuid });

  //  4) Log user in, send JWT
  if (updatedUser) createSendToken(updatedUser, 200, req, res);
});

export const updateEmail = cathAsync(async (req, res, next) => {
  const { email } = req.body;

  // 1) Get user from collection
  const theUser = await User.findOne({
    select: [...ALLOWED_USER_FIELDS, "password"],
    where: {
      uuid: req.currentUser?.uuid,
    },
  });

  // 2) Check if POSTed current password is correct
  if (!theUser) {
    return next(new AppError("wrong login credeintials", 401, BAD_AUTH));
  }

  // 3) update the user  and make validate email to null

  await User.update(
    { uuid: theUser.uuid },
    {
      email,
      email_validate_at: null
    }
  ).catch((e) =>
    next(
      new AppError(`error while updating the password ${e}`, 500, SERVER_ERROR)
    )
  );


  // 4) send validation email
  const pin = crypto.randomBytes(4).toString("hex");
  theUser.email_validation_pin = await crypt.hash(pin, 12);
  theUser.email_validation_pin_expires_at = await new Date(
    new Date().getTime() + EMAIL_PIN_EXPIRATION_IN_MINUTES * 60000
  );
  new EmailSender(theUser, "", pin).sendValidationChangedEmail();

  const updatedUser = await User.findOne({ uuid: theUser.uuid });

  // 5) Ok !
  return res.json({
    status: "success",
    user: updatedUser,
  });

});

export const protect = cathAsync(async (req, _res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) {
    return next(
      new AppError(
        "you are not logged in! Please log in to get access.",
        401,
        BAD_AUTH
      )
    );
  }

  // 2) Verification token
  const decoded = jwt_decode<{ id: string; iat: number; exp: number }>(token);

  // 3) Check if user still exists
  const currentUser = await User.findOne({ uuid: decoded.id });

  if (!currentUser) {
    return next(
      new AppError(
        "the user belonging to this token does no longer exist.",
        401,
        BAD_AUTH
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (
    currentUser.password_changed_at &&
    changedPasswordAfter(decoded.iat, currentUser.password_changed_at)
  ) {
    return next(
      new AppError(
        "user recently changed password! Please log in again.",
        401,
        BAD_AUTH
      )
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.currentUser = currentUser;

  next();
});
