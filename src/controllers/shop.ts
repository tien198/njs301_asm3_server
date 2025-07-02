import type { Request, Response, NextFunction } from 'express'
import type { HydratedDocument, FlattenMaps } from 'mongoose';
import type { IUser } from '../interfaces/user/user.js';
import type { IUserMethods } from '../interfaces/user/index.js';
import type { ICartItem } from '../interfaces/user/cartItem.js';
import type { IProduct } from '../interfaces/product/product.js';
import type { IShippingTracking } from '../interfaces/order/shippingTracking.js';
import type { IOrderItem } from '../interfaces/order/orderItem.js';

import Product from '../models/product.js';
import User from '../models/user/index.js';
import Order from '../models/order/index.js';
import ErrorRes from '../models/errorRes.js';
import { queryProducts } from '../ultilities/shopCtrl/queryProducts.js';
import { validationResult } from 'express-validator';
import { createErrorRes } from '../ultilities/exValidator/createErrorRes.js';
import MailTransporter from '../models/mailTransporter.js';
import orderInformMail from '../ultilities/mailTemplates/orderInfrom.js';
import CartItemDTO from '../DTO/cartItem.js';
import ProductDTO from '../DTO/product.js';
import OrderDTO from '../DTO/order.js';
import { ResData } from '../interfaces/response/error/resData.js';


async function getCountProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await Product.countDocuments()
        res.json({ count })
    } catch (error) {
        next(error)
    }
}

const exceptedFields = '-createdAt -updatedAt -totalQuantity -reservedQuantity -__v'

async function getProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const page = +req.query.page! || 1;
        const limit = +req.query.limit! || 10;
        const skip = (page - 1) * limit;

        const products = await Product.find()
            .skip(skip).limit(limit).sort({ createdAt: -1 })
            .select(exceptedFields)
            .lean()

        // lean product convert _id to id (don't let client know server use Mongoose)
        const productsDTO = products.map(product => new ProductDTO(product))

        res.json(productsDTO)
    } catch (error) {
        next(error)
    }
}

async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await Product.findById(req.params.id)
            .select(exceptedFields)
            .lean()

        if (!product) {
            throw new ErrorRes('Product not found', 404)
        }
        // convert _id to id (don't let client know server use Mongoose)
        const productDTO = new ProductDTO(product)

        res.json(productDTO)
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
            .select(exceptedFields)
            .lean()

        const productsDTO = products.map(product => new ProductDTO(product))

        res.json(productsDTO);
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
            throw new ErrorRes('Failed to connect MongoDb', 500)
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

async function removeFromCart(req: Request, res: Response, next: NextFunction) {
    try {
        const prodId = req.params.productId

        if (!prodId) {
            throw new ErrorRes('Invalid request', 422, { productId: '"productId" request param is required' })
        }

        let user: HydratedDocument<IUser, IUserMethods> | null = null
        try {
            user = await User.findById(req.session.user?.id)
        } catch (error) {
            throw new ErrorRes('Failed to connect MongoDb', 500)
        }

        if (!user) {
            return next(new ErrorRes('User not found', 404))
        }

        const updatedUser = await user.removeFromCart(prodId)

        req.session.user = updatedUser.toJSON()
        await req.session.save()

        res.json({ message: 'Product removed from cart' })
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
            const queries = await queryProducts(cart as any)
            products = queries.products
            cart = queries.cart
        }

        const prodsInCart = products.map((p, index) => new CartItemDTO({
            ...p,
            productId: p._id,
            quantity: cart[index].quantity,
            lineTotal: +p.price * cart[index].quantity
        } as ICartItem))

        res.json(prodsInCart)
    } catch (error) {
        next(error)
    }
}

type OrderBody = {
    shippingTracking: IShippingTracking // { fullName: string, email: string, phone: string, address: string }
    items: ICartItem[] // { productId: string; quantity: number }
}

async function createOrder(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new ErrorRes('Invalid request', 422, createErrorRes(errors))
        }

        const { shippingTracking, items } = req.body as OrderBody

        const { products, cart } = await queryProducts(items)
        for (let i = 0; i < products.length; i++) {
            if (products[i]!.availableQuantity < cart[i].quantity)
                throw new ErrorRes<ResData>('Failed to create Order', 422, { message: 'Insufficient stock: not enough items available in inventory' })
        }

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
            shippingTracking,
        })

        orderItems.forEach(i =>
            Product.findByIdAndUpdate(String(i.productId), {
                $inc: {
                    availableQuantity: -i.quantity,
                    reservedQuantity: +i.quantity
                }
            }).exec()
        )

        // run the folowing in the next tick
        MailTransporter.sendHtmlMail(shippingTracking.email, 'Order Confirmation', orderInformMail(createdDoc))
        if (req.session.user!.email !== shippingTracking.email) {
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
        const page = +req.query.page! || 1
        const limit = +req.query.limit! || 10
        const skip = (page - 1) * limit

        const orders = await Order.find({ userId: req.session.user!.id })
            .select('userId userName items shippingTracking.phone shippingTracking.address shippingTracking.status status totalPrice')
            .skip(skip).limit(limit)
            .sort({ createdAt: -1 }) // Sort by creation date, newest first
            .lean()
        const ordersDTO = orders.map(order => new OrderDTO(order))
        res.json(ordersDTO)
    } catch (error) {
        next(error)
    }
}

async function getOrderById(req: Request, res: Response, next: NextFunction) {
    try {
        const order = await Order.findById(req.params.id)
            .select('userId userName items shippingTracking.phone shippingTracking.address shippingTracking.status status totalPrice')
            .lean()
        const orderDTO = order ? new OrderDTO(order) : null
        res.json(orderDTO)
    } catch (error) {
        next(error)
    }
}



export default { getCountProducts, getProducts, getProductById, getProductByCategory, addToCart, removeFromCart, getCart, createOrder, getOrders, getOrderById }