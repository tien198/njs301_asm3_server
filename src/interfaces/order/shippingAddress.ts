
// Địa chỉ giao hàng
export default interface IShippingAddress {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    district?: string;
    postalCode?: string;
    country?: string;
}