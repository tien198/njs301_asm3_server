import type IOrderItem from "../../interfaces/order/orderItem.js";

import { Schema } from "mongoose";

const OrderItemSchema = new Schema<IOrderItem>({
    productId: { type: Schema.Types.ObjectId, required: true, ref: 'Product' },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    img1: { type: String },
    img2: { type: String },
    img3: { type: String },
    img4: { type: String },
    long_desc: { type: String },
    short_desc: { type: String },
});

export default OrderItemSchema