import type { IProduct, IProductModel } from '../interfaces/product/index.ts';

import mongoose, { Schema } from 'mongoose';

const ProductSchema: Schema<IProduct, IProductModel> = new Schema({
    category: {
        _id: { type: Schema.Types.ObjectId, ref: 'Category' },
        name: { type: String, trim: true }
    },
    img1: { type: String },
    img2: { type: String },
    img3: { type: String },
    img4: { type: String },
    long_desc: { type: String, trim: true },
    name: { type: String, trim: true },
    price: { type: Schema.Types.Number },
    short_desc: { type: String, trim: true }
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            // ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            return ret;
        }
    }
});

// Add instance methods
ProductSchema.methods.getFormattedPrice = function (): string {
    return typeof this.price === 'number'
        ? `$${this.price.toFixed(2)}`
        : this.price;
};

ProductSchema.methods.getAllImages = function (): string[] {
    return [this.img1, this.img2, this.img3, this.img4].filter(img => img);
};

// Create and export the model
const Product = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;
