// Shipping tracking
export interface IShippingTracking {
    fullName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    district: string;
    postalCode: string;
    country: string;

    // Shipping infor
    isDelivered: boolean;
    deliveredAt: Date;
    status: 'waiting for progress' | 'in progress' | 'delivered' | 'cancelled';
    shippingFee: number;
    trackingNumber: string
    carrier: string
}