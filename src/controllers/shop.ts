import type { Request, Response, NextFunction } from 'express'
import type IUser from '../interfaces/user/user.js';
import type { IUserMethods } from '../interfaces/user/index.js';
import type IProduct from '../interfaces/product/product.js';
import type { FlattenMaps, HydratedDocument } from 'mongoose';
import type IOrderItem from '../interfaces/order/orderItem.js';

import Product from '../models/product.js';
import User from '../models/user/index.js';
import Order from '../models/order/index.js';
import ErrorRes from '../models/errorRes.js';
import { queryProducts } from '../ultilities/shopCtrl/queryProducts.js';
import { validationResult } from 'express-validator';
import { createErrorRes } from '../ultilities/exValidator/createErrorRes.js';
import MailTransporter from '../models/mailTransporter.js';
import orderInformMail from '../ultilities/mailTemplates/orderInfrom.js';


const leanProduct = (product: FlattenMaps<IProduct>) => ({ id: String(product._id), ...product, _id: undefined })

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

        // lean product convert _id to id (don't let client know server use Mongoose)
        const leanProducts = products.map(product => leanProduct(product))

        res.json(leanProducts)
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
        // convert _id to id (don't let client know server use Mongoose)
        const lean = leanProduct(product)

        res.json(lean)
    } catch (error) {
        next(error)
    }
}

async function getProductByCategory(req: Request, res: Response, next: NextFunction) {
    try {
        const category = req.params.category

        const page = +req.query.page! || 1;
        const limit = +req.query.limit! || 10;
        const skip = (page - 1) * limit;

        if (!category) {
            throw new ErrorRes('Category is required in params request', 422)
        }

        const products = await Product.find({ category })
            .skip(skip).limit(limit).sort({ createdAt: -1 })
            .select('-__v')
            .lean()

        const leanProducts = products.map(product => leanProduct(product))

        res.json(leanProducts);
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
            user = await User.findById(req.session.user?.id)
        } catch (error) {
            throw new ErrorRes('User not found', 404)
        }

        if (!user) {
            return next(new ErrorRes('User not found', 404))
        }

        const updatedUser = await user.addToCart(productId, quantity)

        req.session.user = updatedUser.toJSON()
        await req.session.save()

        res.json({ message: 'Product added to cart' })
    } catch (error) {
        next(error)
    }
}

async function getCart(req: Request, res: Response, next: NextFunction) {
    try {
        let cart = req.session.user!.cart
        let products: FlattenMaps<IProduct>[] = []
        if (cart.length > 0) {
            // ./utils/queryProducts.ts
            const queries = await queryProducts(cart)
            products = queries.products
            cart = queries.cart
        }

        const cartWithProductInfors = products.map((p, index) => ({
            ...p,
            quantity: cart[index].quantity
        }))

        res.json({ cart: cartWithProductInfors })
    } catch (error) {
        next(error)
    }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ErrorRes('Invalid request', 422, createErrorRes(errors))
        }

        const { fullName, email, phone, address } = req.body

        const { products, cart } = await queryProducts(req.session.user!.cart)
        const orderItems: IOrderItem[] = products.map((p, index) => ({
            productId: p._id,
            name: p.name,
            priceInOrderTime: +p.price,
            quantity: cart[index].quantity,
            category: p.category,
            imageUrl: p.img1,
            lineTotal: +p.price * cart[index].quantity
        }))
        const createdDoc = await Order.create({
            userId: req.session.user!.id,
            userName: req.session.user!.name,
            totalPrice: products.reduce((acc, p, index) => acc + +p.price * cart[index].quantity, 0),
            items: orderItems,
            shippingTracking: { fullName, email, phone, address },
        })


        // run the folowing in the next tick
        MailTransporter.sendHtmlMail(email, 'Order Confirmation', orderInformMail(createdDoc))
        if (req.session.user!.email !== email) {
            // send order confirmation to the email provided in the order
            MailTransporter.sendHtmlMail(req.session.user!.email, 'Order Confirmation', orderInformMail(createdDoc))
        }
        req.session.user!.cart = []
        req.session.save(err => err && console.log(err))
        User.findByIdAndUpdate(req.session.user!.id, { $set: { cart: [] } }).exec().then(err => err && console.log(err))

        res.json({ message: 'Order created successfully' })
    } catch (error) {
        next(error)
    }
}

async function getOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const orders = await Order.find({ userId: req.session.user!.id })
            .select('userId userName  shippingTracking.phone shippingTracking.address shippingTracking.status status')
            .lean()
        res.json(orders)
    } catch (error) {
        next(error)
    }
}

async function getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id)
            .select('userId userName  shippingTracking.phone shippingTracking.address totalPrice items.productId items.name items.priceInOrderTime items.quantity items.imageUrl items.lineTotal')
            .lean()
        res.json(order)
    } catch (error) {
        next(error)
    }
}



export default { getCountProducts, getProducts, getProductById, getProductByCategory, addToCart, getCart, createOrder, getOrders, getOrderById }