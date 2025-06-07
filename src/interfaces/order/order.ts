import type { Types } from "mongoose";
import type IOrderItem from "./orderItem.ts";
import type IShippingAddress from "./shippingAddress.ts";



// Đơn hàng chính
export default interface IOrder {
    userId: Types.ObjectId; // Người đặt hàng

    items: IOrderItem[]; // Danh sách sản phẩm
    shippingAddress: IShippingAddress;

    paymentMethod: 'cod' | 'credit_card' | 'paypal' | 'momo'; // Phương thức thanh toán
    isPaid: boolean;
    paidAt?: Date;

    isDelivered: boolean;
    deliveredAt?: Date;

    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

    totalPrice: number;
    shippingFee: number;
    tax: number;
    discountCode?: string

    trackingNumber?: string
    carrier?: string
}