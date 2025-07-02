
import type { Request, Response, NextFunction } from 'express'

import Order from '../../models/order'
import OrderDTO from '../../DTO/order'

async function getOrders(req: Request, res: Response, next: NextFunction) {
    try {
        const page = +req.query.page! || 1
        const limit = +req.query.limit! || 10
        const skip = (page - 1) * limit

        const orders = await Order.find()
            .select('userId userName items shippingTracking status totalPrice')
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
            .select('userId userName items shippingTracking status totalPrice')
            .lean()
        const orderDTO = order ? new OrderDTO(order) : null
        res.json(orderDTO)
    } catch (error) {
        next(error)
    }
}

const AdminOrderCtrl = {
    getOrders, getOrderById
}

export default AdminOrderCtrl