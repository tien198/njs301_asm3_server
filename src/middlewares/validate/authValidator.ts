import { body, check } from "express-validator";

//  middleware
export const isValidLoginMw = [
    check('email')
        .trim()
        .notEmpty().withMessage('Please enter email').bail()
        .isEmail().withMessage('Please enter a valid email').bail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Please enter password').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').bail(),
];

export const isValidSignupMw = [
    check('name')
        .trim()
        .notEmpty().withMessage('Please enter name').bail(),
    check('email')
        .trim()
        .notEmpty().withMessage('Please enter email').bail()
        .isEmail().withMessage('Please enter a valid email').bail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Please enter password').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').bail(),
    body('confirmPassword')
        .trim()
        .notEmpty().withMessage('Please enter confirm password').bail()
        .custom((val, meta) => {
            if (val !== meta.req.body.password)
                throw new Error('Password confirmation does not match password');
            return true
        }).bail()
];

export const isValidResetPasswordMw = [
    check('email')
        .trim()
        .notEmpty().withMessage('Please enter email').bail()
        .isEmail().withMessage('Please enter a valid email').bail(),
    body('password')
        .trim()
        .notEmpty().withMessage('Please enter password').bail()
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long').bail(),
];