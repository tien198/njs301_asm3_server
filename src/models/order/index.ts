import type IOrderModel from '../../interfaces/order/index.ts';
import type IOrderItem from '../../interfaces/order/orderItem.ts';

import mongoose, { Schema } from 'mongoose';
import OrderItemSchema from './orderItem.js';
import ShippingAddressSchema from './shippingAddress.js';




const OrderSchema = new Schema<IOrderModel>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    items: {
        type: [OrderItemSchema],
        required: true,
        validate: [
            (items: IOrderItem[]) => items.length > 0,
            'Order must have at least one item'
        ]
    },
    shippingAddress: {
        type: ShippingAddressSchema,
        required: true
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['cod', 'credit_card', 'paypal', 'momo']
    },
    isPaid: {
        type: Boolean,
        default: false
    },
    paidAt: Date,
    isDelivered: {
        type: Boolean,
        default: false
    },
    deliveredAt: Date,
    status: {
        type: String,
        required: true,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    totalPrice: {
        type: Number,
        required: true,
        min: 0
    },
    shippingFee: {
        type: Number,
        required: true,
        min: 0
    },
    tax: {
        type: Number,
        required: true,
        min: 0
    },
    discountCode: String,

    trackingNumber: String,
    carrier: String
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});





OrderSchema.methods.getTotalAmount = function (): number {
    return this.totalPrice + this.shippingFee + this.tax;
};

OrderSchema.methods.canBeCancelled = function (): boolean {
    return ['pending', 'processing'].includes(this.status);
};

OrderSchema.methods.canBeModified = function (): boolean {
    return this.status === 'pending';
};

// Add useful static methods
OrderSchema.statics.findByUser = function (userId: string) {
    return this.find({ userId }).sort({ createdAt: -1 });
};

// Add indexes for better query performance
OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1 });
OrderSchema.index({ trackingNumber: 1 });

const Order = mongoose.model<IOrderModel>('Order', OrderSchema);
export default Order;
