import type { IOrder } from "../interfaces/order/order.js";
import type { IOrderItem } from "../interfaces/order/orderItem.js";
import type { IShippingTracking } from "../interfaces/order/shippingTracking.js";

export default class OrderDTO implements Partial<IOrder> {
    id: string;
    userName: string;
    shippingTracking: IShippingTracking;
    items: IOrderItem[];
    totalPrice: number;
    tax: number;
    discountCode: string;
    status: 'waiting' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: 'cod' | 'credit_card' | 'paypal' | 'momo';
    isPaid: boolean;
    paidAt?: Date;

    constructor(order: IOrder) {
        this.id = String(order._id);
        this.userName = order.userName;
        this.shippingTracking = order.shippingTracking;
        this.items = order.items;
        this.totalPrice = order.totalPrice;
        this.tax = order.tax;
        this.discountCode = order.discountCode;
        this.status = order.status;
        this.paymentMethod = order.paymentMethod;
        this.isPaid = order.isPaid;
        this.paidAt = order.paidAt
    }
}