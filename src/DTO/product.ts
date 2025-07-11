import type { IProduct } from "../interfaces/product";

export default class ProductDTO implements Partial<IProduct> {
    id: string;
    name: string;
    price: number;
    category: string;
    img1: string
    img2: string
    img3: string
    img4: string
    long_desc: string
    short_desc: string
    availableQuantity: number

    constructor(product: IProduct, quantity?: number) {
        this.id = String(product._id);
        this.name = product.name;
        this.price = +product.price;
        this.category = product.category;
        this.img1 = product.img1;
        this.img2 = product.img2;
        this.img3 = product.img3;
        this.img4 = product.img4;
        this.long_desc = product.long_desc;
        this.short_desc = product.short_desc;
        this.availableQuantity = product.availableQuantity;
    }
}