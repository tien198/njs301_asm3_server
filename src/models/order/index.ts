import type { IOrderMethods, IOrderModel } from '../../interfaces/order/index.ts';
import type IOrderItem from '../../interfaces/order/orderItem.ts';
import type IOrder from '../../interfaces/order/order.ts';

import mongoose, { Schema } from 'mongoose';
import OrderItemSchema from './orderItem.js';
import ShippingAddressSchema from './shippingAddress.js';




const OrderSchema = new Schema<IOrder, IOrderModel, IOrderMethods>({
    userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    items: { type: [OrderItemSchema], required: true, validate: [(items: IOrderItem[]) => items.length > 0, 'Order must have at least one item'] },
    totalPrice: { type: Number, required: true, min: 0 },
    tax: { type: Number, min: 0 },
    discountCode: { type: String },

    // payment infor
    paymentMethod: { type: String, enum: ['cod', 'credit_card', 'paypal', 'momo'] },
    isPaid: { type: Boolean, default: false },
    paidAt: { type: Date },

    // Shipping infor
    shippingAddress: { type: ShippingAddressSchema },
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingFee: { type: Number, min: 0 },
    trackingNumber: { type: String },
    carrier: { type: String },
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






    // Add instance methods
    methods: {
        getTotalAmount(): number {
            return this.totalPrice + this.shippingFee + this.tax;
        },
        canBeCancelled(): boolean {
            return ['pending', 'processing'].includes(this.status);
        },
        canBeModified(): boolean {
            return this.status === 'pending';
        }
    },
});



// Add indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ trackingNumber: 1 });


const Order = mongoose.model('Order', OrderSchema);
export default Order;