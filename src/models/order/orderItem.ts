import type IOrderItem from "../../interfaces/order/orderItem.js";

import { Schema } from "mongoose";
import { CategorySubdocSchema } from "../product.js";

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    priceInOrderTime: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    category: { type: CategorySubdocSchema, required: true },
    imageUrl: { type: String, required: true },
}, {
    _id: false,
    timestamps: false
});

export default OrderItemSchema