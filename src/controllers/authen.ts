import type { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/user/index.js';
import ErrorRes from '../models/errorRes.js';
import { createErrorRes } from '../ultilities/exValidator/createErrorRes.js';


async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorRes('login failed', 422, createErrorRes(errors))
        }

        const { email, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            throw new ErrorRes('login failed', 401, { message: "User or password is incorrect" })
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ErrorRes('login failed', 401, { message: "User or password is incorrect" })
        }

        // Set session
        req.session.user = user.toObject()
        req.session.save()

        res.json({
            user: { ...req.session.user, password: undefined, cart: undefined }
        });

    } catch (error) {
        next(error)
    }
};



async function signup(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorRes('signup failed', 422, createErrorRes(errors))
        }

        const { email, password, name } = req.body;

        // Check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            throw new ErrorRes('signup failed', 400, { message: "User already exists" })
        }

        // Hash password
        const saltLength = Number(process.env.SALT_LENGTH) || 10

        const hashedPassword = bcrypt.hashSync(password, saltLength);

        // Create new user
        user = await User.create({ email, password: hashedPassword, name });

        // Set session
        req.session.user = user.toObject()
        req.session.save()

        res.status(201).json({
            user: { ...req.session.user, password: undefined, cart: undefined }
        });

    } catch (error) {
        next(error)
    }
};



async function resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            throw new ErrorRes('reset password failed', 422, createErrorRes(errors))
        }

        const { email } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new ErrorRes('reset password failed', 404, { message: "User not found" })
        }

        // In a real application, you would:
        // 1. Generate a reset token
        // 2. Save it to the user record with an expiration
        // 3. Send an email with a reset link
        // For this example, we'll just send a success response

        res.json({ message: "Password reset instructions sent to your email" });

    } catch (error) {
        next(error)
    }
};



export default { login, signup, resetPassword }