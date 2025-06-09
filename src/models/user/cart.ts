import { Schema } from "mongoose";

const CartSchema = new Schema({
    productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
})


export default CartSchema