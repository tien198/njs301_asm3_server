import type { Types } from "mongoose";
import type IProduct from "../product/product";

// Item trong đơn hàng
export default interface IOrderItem extends Partial<IProduct> {
    productId: Types.ObjectId; // ID sản phẩm
    quantity: number;  // Số lượng mua
}