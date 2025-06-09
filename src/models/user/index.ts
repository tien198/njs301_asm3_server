import type IUser from '../../interfaces/user/user.js';
import type { IUserMethods, IUserModel } from '../../interfaces/user/index.js';

import { model, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import CartSchema from './cart.js';
import Product from '../product.js';
import ErrorRes from '../errorRes.js';



const UserSchema = new Schema<IUser, IUserModel, IUserMethods>({
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: {
        type: String, select: false, required: true
        // To include the password field in a query, use `.select('+password')` like this:
        // User.findOne({ email: 'example@example.com' }).select('+password')
    },
    name: { type: String, trim: true },
    phone: { type: Schema.Types.String },
    avatarUrl: { type: String },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    cart: { type: [CartSchema], default: [] }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            // ret.id = ret._id.toString();
            // delete ret._id;
            delete ret.__v;
            // CRUCIAL security
            delete ret.password;
            return ret;
        }
    },


    // Add instance methods
    methods: {
        comparePassword: async function (candidatePassword: string): Promise<boolean> {
            try {
                return await bcrypt.compare(candidatePassword, this.password);
            } catch (error) {
                throw new Error('Error comparing passwords');
            }
        },

        async addToCart(productId, quantity) {
            const product = await Product.findById(productId)
            if (!product) {
                throw new ErrorRes('Product not found', 404)
            }
            const existItem = this.cart.find(i => i.productId.toString() === productId)
            if (existItem) {
                existItem.quantity += quantity
            } else {
                this.cart.push({ productId: product._id, quantity })
            }

            return await this.save()
        },
    }
});

const User = model('User', UserSchema);

export default User;
