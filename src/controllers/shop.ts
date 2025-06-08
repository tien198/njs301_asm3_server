import type { Request, Response, NextFunction } from 'express'
import Product from '../models/product.js';
import ErrorRes from '../models/errorRes.js';

async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const page = +req.query.page! || 1;
        const limit = +req.query.limit! || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip).limit(limit).sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        res.json(products)
    } catch (error) {
        next(error)
    }
}

async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await Product.findById(req.params.id)
            .select('-__v')
            .lean()

        if (!product) {
            return next(new ErrorRes('Product not found', 404))
        }

        res.json(product);
    } catch (error) {
        next(error)
    }
}

export default { getProducts, getProductById }