import type { Types } from "mongoose";
import type IProduct from "../product/product";

// Item trong đơn hàng
export default interface ICartItem extends Partial<IProduct> {
    productId: Types.ObjectId; // ID sản phẩm
    name: string;
    category: string; // Danh mục sản phẩm
    price: string | number
    img1: string
    img2: string
    img3: string
    img4: string
    long_desc: string
    short_desc: string
    quantity: number;  // Số lượng mua
    lineTotal: number; // priceInOrderTime * quantity
}