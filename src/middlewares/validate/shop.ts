import { body } from "express-validator";

export const addToCartValidatorMw = [
    body('productId').trim()
        .notEmpty().withMessage('Product ID is required').bail()
        .isMongoId().withMessage('Invalid product ID').bail(),
    body('quantity').trim()
        .notEmpty().withMessage('Quantity is required').bail()
        .isInt({ min: 1 }).withMessage('Quantity must be greater than 0').bail()
]

