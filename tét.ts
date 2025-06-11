import { Types } from "mongoose"

interface data {
    userId: {
        name: string
        phone: string
    }
    shippingTracking:{
        fullName: string;
        phone: string;
        address: string;
        city: string;
        district: string;
        postalCode: string;
        country: string;
    
        // Shipping infor
        isDelivered: boolean;
        deliveredAt: Date;
        status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
        shippingFee: number;
        trackingNumber: string
        carrier: string
    }
    items: {
        productId: Types.ObjectId
        priceInOrderTime: number
        quantity: number
        category: {
            _id: Types.ObjectId
            name: string
        }
    }[]
}