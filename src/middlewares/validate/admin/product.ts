import { body, param } from 'express-validator';
import { validate } from '../validationResult';

export const productIdValidatorMw = [
    param('id')
        .notEmpty().withMessage('ProductId param is required'),

    validate('ProductId param is required')
];

export const createProductValidatorMw = [
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required').bail(),

    body('name')
        .trim()
        .notEmpty().withMessage('Name is required').bail(),

    body('price')
        .trim()
        .notEmpty().withMessage('Price is required').bail(),

    body('img1').trim().optional().isURL().withMessage('img1 must be a valid URL').bail(),
    body('img2').trim().optional().isURL().withMessage('img2 must be a valid URL').bail(),
    body('img3').trim().optional().isURL().withMessage('img3 must be a valid URL').bail(),
    body('img4').trim().optional().isURL().withMessage('img4 must be a valid URL').bail(),

    validate('Create product failed')
];

export const updateProductValidatorMw = [
    param('id')
        .notEmpty().withMessage('ProductId param is required'),

    body('category')
        .notEmpty().withMessage('Category is required').bail(),

    body('name')
        .notEmpty().withMessage('Name is required').bail(),

    body('price')
        .notEmpty().withMessage('Price is required').bail(),

    body('img1').optional().isURL().withMessage('img1 must be a valid URL').bail(),
    body('img2').optional().isURL().withMessage('img2 must be a valid URL').bail(),
    body('img3').optional().isURL().withMessage('img3 must be a valid URL').bail(),
    body('img4').optional().isURL().withMessage('img4 must be a valid URL').bail(),

    validate('Update product failed')
];
