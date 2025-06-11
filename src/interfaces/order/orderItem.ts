import type { Types } from "mongoose";
import type IProduct from "../product/product";

// Item trong đơn hàng
export default interface IOrderItem extends Partial<IProduct> {
    productId: Types.ObjectId; // ID sản phẩm
    name: string;
    priceInOrderTime: number; // Giá sản phẩm tại thời điểm đặt hàng
    quantity: number;  // Số lượng mua
    category: {
        _id: Types.ObjectId
        name: string
    }
    imageUrl: string;
    lineTotal: number; // priceInOrderTime * quantity
}