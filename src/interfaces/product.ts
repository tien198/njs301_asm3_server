
export interface IProduct {
    _id?: string
    category?: string
    img1?: string
    img2?: string
    img3?: string
    img4?: string
    long_desc?: string
    name?: string
    price?: string | number
    short_desc?: string
}


// Add methods interface if needed
export interface IProductMethods {
    getFormattedPrice(): string;
    getAllImages(): string[];
}

// Combine the document interface with methods
export interface IProductModel extends IProduct, IProductMethods { }