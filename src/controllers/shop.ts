import type { Request, Response, NextFunction } from 'express'
import Product from '../models/product.js';
import User from '../models/user/index.js';
import ErrorRes from '../models/errorRes.js';
import { HydratedDocument } from 'mongoose';
import IUser from '../interfaces/user/user.js';
import { IUserMethods } from '../interfaces/user/index.js';
import IProduct from '../interfaces/product/product.js';

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
            throw new ErrorRes('Product not found', 404)
        }

        res.json(product);
    } catch (error) {
        next(error)
    }
}

async function getProductByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const page = +req.query.page! || 1;
        const limit = +req.query.limit! || 10;
        const skip = (page - 1) * limit;

        const category = req.body.category
        if (!category) {
            throw new ErrorRes('Not found relevant products', 404, { category: 'category is required in body request' })
        }

        const products = await Product.find({ category })
            .skip(skip).limit(limit).sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        if (products.length === 0) {
            throw new ErrorRes('Not found relevant products', 404)
        }

        res.json(products);
    } catch (error) {
        next(error)
    }
}

async function addToCart(req: Request, res: Response, next: NextFunction) {
    try {
        const productId = req.body.productId as string
        const quantity = +req.body.quantity

        if (!productId) {
            throw new ErrorRes('Invalid request', 422, { productId: 'productId is required' })
        }
        if (!quantity || quantity <= 0) {
            throw new ErrorRes('Invalid request', 422, { quantity: 'quantity is required and must be greater than 0' })
        }

        let product: HydratedDocument<IProduct> | null = null
        try {
            product = await Product.findById(productId)

        } catch (error) {
            throw new ErrorRes('Product not found', 404)
        }

        let user: HydratedDocument<IUser, IUserMethods> | null = null
        try {
            user = await User.findById(req.session.user?._id)
        } catch (error) {
            throw new ErrorRes('User not found', 404)
        }

        if (!user) {
            return next(new ErrorRes('User not found', 404))
        }

        await user.addToCart(productId, quantity)

        res.json({ message: 'Product added to cart' })
    } catch (error) {
        next(error)
    }
}

export default { getProducts, getProductById, getProductByCategory, addToCart }