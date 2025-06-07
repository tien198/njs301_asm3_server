import type { Types } from "mongoose";
import type IOrderItem from "./orderItem.ts";
import type IShippingAddress from "./shippingAddress.ts";



export default interface IOrder {
    userId: Types.ObjectId; // ordered user
    items: IOrderItem[]; // products list
    totalPrice: number;
    tax: number;
    discountCode?: string

    // payment infor
    paymentMethod: 'cod' | 'credit_card' | 'paypal' | 'momo';
    isPaid: boolean;
    paidAt?: Date;

    // Shipping infor
    shippingAddress: IShippingAddress;
    isDelivered: boolean;
    deliveredAt?: Date;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    shippingFee: number;
    trackingNumber?: string
    carrier?: string
}