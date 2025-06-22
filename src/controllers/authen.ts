import type { NextFunction, Request, Response } from 'express';
import type { IAuthError } from '../interfaces/response/error/authError.js';

import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import User from '../models/user/index.js';
import ErrorRes from '../models/errorRes.js';
import { createErrorRes } from '../ultilities/exValidator/createErrorRes.js';
import UserDTO from '../DTO/user.js';
import { IUser } from '../interfaces/user/user.js';


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
            throw new ErrorRes<IAuthError>('login failed', 401, { credential: "User or password is incorrect" })
        }

        // Validate password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            throw new ErrorRes<IAuthError>('login failed', 401, { credential: "User or password is incorrect" })
        }

        // Set session
        req.session.user = user.toJSON()
        req.session.save()

        res.json({
            user: new UserDTO(user)
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
            throw new ErrorRes<IAuthError>('signup failed', 400, { email: "User already exists" })
        }

        // Hash password
        const saltLength = Number(process.env.SALT_LENGTH) || 10

        const hashedPassword = bcrypt.hashSync(password, saltLength);

        // Create new user
        user = await User.create({ email, password: hashedPassword, name });

        // Set session
        req.session.user = user.toJSON()
        await req.session.save()

        res.status(201).json({
            user: new UserDTO(user)
        });

    } catch (error) {
        next(error)
    }
};


async function getAuthStatus(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.session.user || req.session.user!.role !== 'admin') {
            throw new ErrorRes('Unauthorize', 401, { message: "Unauthorize, please login to continuon" });
        }
        res.json({
            user: new UserDTO(req.session.user as IUser)
        });
    } catch (error) {
        next(error);
    }
}

async function logout(req: Request, res: Response, next: NextFunction) {
    // Destroy session
    req.session.destroy((err) => {
        if (err) {
            return next(new ErrorRes('Logout failed', 500, { message: "Failed to logout" }));
        }
        res.json({ message: "Logged out successfully" });
    });
}


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



export default { login, signup, logout, getAuthStatus, resetPassword }