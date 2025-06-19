import { body } from "express-validator";



export const createOrderValidatorMw = [
    body('shippingTracking.fullName').trim()
        .notEmpty().withMessage('Full name is required').bail(),
    body('shippingTracking.email').trim()
        .notEmpty().withMessage('Email is required').bail()
        .isEmail().withMessage('Invalid email').bail(),
    body('shippingTracking.phone').trim()
        .notEmpty().withMessage('Phone is required').bail()
        .isMobilePhone('vi-VN').withMessage('Invalid phone number').bail(),
    body('shippingTracking.address').trim()
        .notEmpty().withMessage('Address is required').bail(),

    body('items').isArray({ min: 1 }).withMessage('Items must be an array and at least 1 item').bail()
]