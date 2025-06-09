import { model, Schema } from "mongoose";

const CartSchema = new Schema({
    productRef: { type: Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 }
})


export default CartSchema