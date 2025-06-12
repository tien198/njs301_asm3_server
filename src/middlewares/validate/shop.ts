import { body } from "express-validator";

export const addToCartValidatorMw = [
    body('productId').trim()
        .notEmpty().withMessage('Product ID is required').bail()
        .isMongoId().withMessage('Invalid product ID').bail(),
    body('quantity').trim()
        .notEmpty().withMessage('Quantity is required').bail()
        .isInt({ min: 1 }).withMessage('Quantity must be greater than 0').bail()
]

export const createOrderValidatorMw = [
    body('fullName').trim()
        .notEmpty().withMessage('Full name is required').bail(),
    body('email').trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email').bail(),
    body('phone').trim()
        .notEmpty().withMessage('Phone is required').bail()
        .isMobilePhone('vi-VN').withMessage('Invalid phone number').bail(),
    body('address').trim()
        .notEmpty().withMessage('Address is required').bail()
]