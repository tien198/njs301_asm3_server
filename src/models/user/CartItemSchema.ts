import { Schema } from "mongoose";

const CartItemSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
}, {
    _id: false,
    timestamps: false
})


export default CartItemSchema