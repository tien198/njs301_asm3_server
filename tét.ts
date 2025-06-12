import { Types } from "mongoose"

interface Order {
    userId: Types.ObjectId,
    userName: string, 11
    items: {
        productId: Types.ObjectId; // ID sản phẩm
        name: string;
        priceInOrderTime: number; // Giá sản phẩm tại thời điểm đặt hàng
        quantity: number;  // Số lượng mua
        imageUrl: string;
        lineTotal: number; // thành tiền
    }[],
    shippingTracking: {
        address: string
        phone: string
    }
}