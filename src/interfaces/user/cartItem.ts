import type { Types } from "mongoose";
import type { IProduct } from "../product/product";

// Item trong đơn hàng
export interface ICartItem extends Omit<IProduct, 'sku' | 'totalQuantity' | 'availableQuantity' | 'reservedQuantity'> {
    productId: Types.ObjectId; // ID sản phẩm
    quantity: number;  // Số lượng mua
    lineTotal: number; // priceInOrderTime * quantity

    // name: string;
    // category: string; // Danh mục sản phẩm
    // price: string | number
    // img1: string
    // img2: string
    // img3: string
    // img4: string
    // long_desc: string
    // short_desc: string

}