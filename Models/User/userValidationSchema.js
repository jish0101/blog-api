import { body, query } from 'express-validator';

// create user
export const userValidatonSchema = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage('Name should have min 3 and max 30 characters'),
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email format is invalid')
    .isString()
    .withMessage('Email must be a string'),
  body('password')
    .notEmpty()
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage('Password must be at least 4 and atmost 30 characters'),
  body('profile').exists(),
];

// update user
export const userValidatonSchemaPut = [
  body('name')
    .isString()
    .notEmpty()
    .withMessage('Name must be a string')
    .trim()
    .isLength({ min: 4, max: 30 })
    .withMessage('Name should have min 3 and max 30 characters'),
  body('email')
    .isEmail()
    .notEmpty()
    .withMessage('Email format is invalid')
    .isString()
    .withMessage('Email must be a string'),
];

// get users
export const userValidationGet = [
  query('page').isInt({ min: 1 }).optional(),
  query('rowCount').isInt({ min: 1 }).optional(),
];

// verify email
export const userEmailValidation = [
  body('email').isString().isEmail().notEmpty(),
  body('otp').isNumeric().notEmpty(),
];

// request otp
export const userOtpReqValidation = [
  body('email').isString().isEmail().notEmpty(),
  body('type').isString().notEmpty(),
];
