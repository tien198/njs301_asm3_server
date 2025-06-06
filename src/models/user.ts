import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose';
import type { IUserModel } from '../interfaces/user.js';



const UserSchema: Schema = new Schema({
    email: {
        type: String, required: true, unique: true, trim: true, lowercase: true
    },
    password: {
        type: String, select: false // This ensures the password isn't returned in queries by default
        // To include the password field in a query, use `.select('+password')` like this:
        // User.findOne({ email: 'example@example.com' }).select('+password')
    },
    name: {
        type: String,        trim: true
    },
    phone: {
        type: Schema.Types.String, // Allows both string and number
    }
}, {
    timestamps: true, // Adds createdAt and updatedAt timestamps
    toJSON: {
        virtuals: true,
        transform: function (doc, ret) {
            ret.id = ret._id.toString();
            delete ret._id;
            delete ret.__v;
            delete ret.password;
            return ret;
        }
    }
});

// Add instance methods
UserSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    try {
        // Note: In a real application, you should use bcrypt.compare()
        // This is just a simple example
        return this.password === candidatePassword;
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

UserSchema.methods.fullName = function(): string {
    return this.name || '';
};

// Create and export the model
const User = mongoose.model<IUserModel>('User', UserSchema);
export default User;
