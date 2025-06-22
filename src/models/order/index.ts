import type { IOrderMethods, IOrderModel } from '../../interfaces/order/index.ts';
import type { IOrderItem } from '../../interfaces/order/orderItem.ts';
import type { IOrder } from '../../interfaces/order/order.ts';

import mongoose, { Schema } from 'mongoose';
import OrderItemSchema from './orderItem.js';
import ShippingTrackingSchema from './shippingTracking.js';




const OrderSchema = new Schema<IOrder, IOrderModel, IOrderMethods>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    userName: { type: String },
    items: { type: [OrderItemSchema], required: true, validate: [(items: IOrderItem[]) => items.length > 0, 'Order must have at least one item'] },
    totalPrice: { type: Number, required: true, min: 0 },
    tax: { type: Number, min: 0 },
    discountCode: { type: String },
    status: { type: String, enum: ['waiting', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'waiting' },

    // payment infor
    paymentMethod: { type: String, enum: ['cod', 'credit_card', 'paypal', 'momo'] },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // Shipping infor
    shippingTracking: { type: ShippingTrackingSchema, required: true },

}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            // ret.id = ret._id.toString();
            // delete ret._id;
            delete ret.__v;
            return ret;
        }
    },
});

// Add instance methods
OrderSchema.methods = {

    getTotalAmount(): number {
        return this.totalPrice + this.shippingTracking.shippingFee + this.tax;
    },
    canBeCancelled(): boolean {
        return ['waiting for progress', 'in progress'].includes(this.shippingTracking.status);
    },
    canBeModified(): boolean {
        return this.shippingTracking.status === 'waiting for progress';
    }
}



// Add indexes for better query performance
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ trackingNumber: 1 });
OrderSchema.index({ 'items.category._id': 1 });

const Order = mongoose.model<IOrder, IOrderModel>('Order', OrderSchema);
export default Order;