import type { Request, Response, NextFunction } from 'express'
import User from '../../models/user'
import Order from '../../models/order'


async function getUserCount(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await User.countDocuments().exec()
        res.json(count)
    } catch (error) {
        next(error)
    }
}

async function getOrderCount(req: Request, res: Response, next: NextFunction) {
    try {
        const count = await Order.countDocuments().exec()
        res.json(count)
    } catch (error) {
        next()
    }
}

// async function getEarningOfMonth(req: Request, res: Response, next: NextFunction) {
//     try {
//         const now = new Date()
//         // Lấy ngày đầu tháng
//         const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//         // Lấy ngày cuối tháng
//         const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

//         const cursor = Order.find({
//             createdAt: { $gte: startOfMonth, $lte: endOfMonth }
//         }).select('totalPrice').cursor();



//     } catch (error) {
//         next(error)
//     }
// }

const AdminStatistic = {
    getUserCount, getOrderCount
}

export default AdminStatistic