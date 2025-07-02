import type { Types } from "mongoose";
import type { IProduct } from "../product/product";

// Item trong đơn hàng
export interface IOrderItem extends Partial<Omit<IProduct, 'totalQuantity' | 'availableQuantity' | 'reservedQuantity'>> {
    productId: Types.ObjectId; // ID sản phẩm
    name: string;
    priceInOrderTime: number; // Giá sản phẩm tại thời điểm đặt hàng
    category: string; // Danh mục sản phẩm
    imageUrl: string;
    quantity: number;  // Số lượng mua
    lineTotal: number; // priceInOrderTime * quantity
}
