import { model, Schema } from "mongoose";
import ICategory from "../interfaces/category/category";
import { ICategoryModel } from "../interfaces/category";

const categorySchema = new Schema<ICategory, ICategoryModel>({
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'Category', default: null },
    image: { type: String },
    description: { type: String },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret._id = ret._id.toString();
            delete ret.__v;
            return ret;
        }
    }
});

const Category = model<ICategory, ICategoryModel>('Category', categorySchema);

export default Category;