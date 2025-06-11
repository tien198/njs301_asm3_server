import type IOrderItem from "../../interfaces/order/orderItem.js";

import { Schema } from "mongoose";

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    priceInOrderTime: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    category: {
        type: {
            _id: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
            name: { type: String, trim: true, required: true }
        },
        required: true
    },
    imageUrl: { type: String, required: true },
}, {
    _id: false,
    timestamps: false
});

export default OrderItemSchema