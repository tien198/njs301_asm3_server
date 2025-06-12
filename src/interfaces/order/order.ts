import type { Types } from "mongoose";
import type IOrderItem from "./orderItem.ts";
import type IShippingTracking from "./shippingTracking.ts";



export default interface IOrder {
    userId: Types.ObjectId; // ordered user
    userName: string;
    items: IOrderItem[]; // products list
    totalPrice: number;
    tax: number;
    discountCode: string
    status: 'waiting' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

    // payment infor
    paymentMethod: 'cod' | 'credit_card' | 'paypal' | 'momo';
    isPaid: boolean;
    paidAt?: Date;

    // Shipping tracking infor
    shippingTracking: IShippingTracking;

}