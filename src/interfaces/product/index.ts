import type { Model } from "mongoose";
import type { IProduct } from "./product.js";


export type { IProduct }

export interface IProductMethods {
    getFormattedPrice(): string;
    getAllImages(): string[];
}


// Combine the document interface with methods
export interface IProductModel extends Model<IProduct> { }