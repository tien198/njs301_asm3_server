// Shipping tracking
export default interface IShippingTracking {
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