import type { Model } from "mongoose";
import type { IOrder } from "./order.ts";
import type { IOrderItem } from './orderItem.ts'
import type { IShippingTracking } from "./shippingTracking.ts";
2
export type { IOrder, IOrderItem, IShippingTracking }

// Add useful instance methods
export interface IOrderMethods {
    getTotalAmount(): number;
    canBeCancelled(): boolean;
    canBeModified(): boolean;
}

export interface IOrderModel extends Model<IOrder> { }