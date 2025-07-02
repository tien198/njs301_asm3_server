import type { Types } from "mongoose";
import { ICartItem } from "../interfaces/user/cartItem";

// Item trong đơn hàng
export default class CartItemDTO implements Omit<ICartItem, '_id' | 'productId'> {
    productId: string; // ID sản phẩm
    name: string;
    price: number; // Giá sản phẩm tại thời điểm đặt hàng
    quantity: number;  // Số lượng mua
    category: string; // Danh mục sản phẩm
    img1: string
    img2: string
    img3: string
    img4: string
    img5: string
    long_desc: string
    short_desc: string
    lineTotal: number; // priceInOrderTime * quantity

    constructor(product: ICartItem) {
        this.productId = String(product.productId);
        this.name = product.name;
        this.price = +product.price;
        this.quantity = product.quantity;
        this.category = product.category;
        this.img1 = product.img1;
        this.img2 = product.img2;
        this.img3 = product.img3;
        this.img4 = product.img4;
        this.img5 = product.img5;
        this.long_desc = product.long_desc;
        this.short_desc = product.short_desc;
        this.lineTotal = product.lineTotal;
    }
}