import type { Model } from "mongoose";
import type IOrder from "./order.ts";
import type IOrderItem from './orderItem.ts'
import type IShippingAddress from "./shippingAddress.ts";

export type { IOrder, IOrderItem, IShippingAddress }

// Add useful instance methods
export interface IOrderMethods {
    getTotalAmount(): number;
    canBeCancelled(): boolean;
    canBeModified(): boolean;
}

export interface IOrderModel extends Model<IOrder> { }