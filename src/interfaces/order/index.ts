import type IOrder from "./order.ts";


// Add useful instance methods
export interface IOrderMethods {
    getTotalAmount(): number;
    canBeCancelled(): boolean;
    canBeModified(): boolean;
}

export default interface IOrderModel extends IOrder, IOrderMethods { }