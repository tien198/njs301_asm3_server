import type { Types } from "mongoose";

// Item trong đơn hàng
export interface IOrderItem {
    productId: Types.ObjectId; // ID sản phẩm
    name: string;      // Tên sản phẩm (dự phòng nếu sản phẩm bị xóa)
    price: number;     // Giá tại thời điểm đặt
    quantity: number;  // Số lượng mua
    image?: string;    // Hình ảnh sản phẩm (tùy chọn)
}

// Địa chỉ giao hàng
export interface IShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district?: string;
    postalCode?: string;
    country?: string;
}

// Đơn hàng chính
export interface IOrder {
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

// Add useful instance methods
export interface IOrderMethods {
    getTotalAmount(): number;
    canBeCancelled(): boolean;
    canBeModified(): boolean;
}

export interface IOrderModel extends IOrder, IOrderMethods {}