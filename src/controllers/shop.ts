import type { Request, Response, NextFunction } from 'express'
import Product from '../models/product.js';
import User from '../models/user/index.js';
import ErrorRes from '../models/errorRes.js';
import { FlattenMaps, HydratedDocument, Types } from 'mongoose';
import IUser from '../interfaces/user/user.js';
import { IUserMethods } from '../interfaces/user/index.js';
import IProduct from '../interfaces/product/product.js';
import Order from '../models/order/index.js';
import { queryProducts } from '../ultilities/shopCtrl/queryProducts.js';
import { validationResult } from 'express-validator';
import { createErrorRes } from '../ultilities/exValidator/createErrorRes.js';

async function getCountProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await Product.countDocuments()
        res.json({ count })
    } catch (error) {
        next(error)
    }
}

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
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ErrorRes('Invalid request', 422, createErrorRes(errors))
        }

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

        const updatedUser = await user.addToCart(productId, quantity)

        req.session.user = updatedUser
        await req.session.save()

        res.json({ message: 'Product added to cart' })
    } catch (error) {
        next(error)
    }
}

async function getCart(req: Request, res: Response, next: NextFunction) {
    try {
        const cart = req.session.user!.cart
        let products: FlattenMaps<IProduct>[] = []
        if (cart.length > 0) {
            // ./utils/queryProducts.ts
            products = await queryProducts(cart)
        }

        res.json({ cart: products })
    } catch (error) {
        next(error)
    }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const cart = req.session.user!.cart

        const products = await queryProducts(cart)

        await Order.create({
            userId: req.session.user?._id,
            totalPrice: products.reduce((acc, p, index) => acc + +p.price * cart[index].quantity, 0),
            items: products.map((p, index) => ({
                productId: p._id,
                quantity: cart[index].quantity,
                ...p,
                _id: undefined,
                __v: undefined,
                createdAt: undefined,
                updatedAt: undefined,
            }))
        })

        // run the folowing in the next tick
        req.session.user!.cart = []
        req.session.save(err => err && console.log(err))
        User.findByIdAndUpdate(req.session.user?._id, { $set: { cart: [] } }).exec().then(err => err && console.log(err))

        res.json({ message: 'Order created successfully' })
    } catch (error) {
        next(error)
    }
}



export default { getCountProducts, getProducts, getProductById, getProductByCategory, addToCart, getCart, createOrder }