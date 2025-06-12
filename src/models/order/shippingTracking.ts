import type IShippingTracking from "../../interfaces/order/shippingTracking.js";

import { Schema } from "mongoose";

const ShippingTrackingSchema = new Schema<IShippingTracking>({
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, trim: true },
    district: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, trim: true, default: 'Vietnam' },

    // Shipping infor
    isDelivered: { type: Boolean, default: false },
    deliveredAt: { type: Date },
    status: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    shippingFee: { type: Number, min: 0 },
    trackingNumber: { type: String },
    carrier: { type: String },
}, {
    _id: false,
    timestamps: false
});

export default ShippingTrackingSchema;