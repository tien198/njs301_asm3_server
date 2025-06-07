import type IShippingAddress from "../../interfaces/order/shippingAddress.ts";

import { Schema } from "mongoose";

const ShippingAddressSchema = new Schema<IShippingAddress>({
    fullName: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true,
        trim: true
    },
    city: {
        type: String,
        required: true,
        trim: true
    },
    district: {
        type: String,
        trim: true
    },
    postalCode: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true,
        default: 'Vietnam'
    }
});

export default ShippingAddressSchema