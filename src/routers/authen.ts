import express, { Router } from 'express';
import authenCtrl from '../controllers/authen.ts';
import { isValidLoginMw, isValidResetPasswordMw, isValidSignupMw } from '../middlewares/validate/authValidator.ts';

const router = Router();

router.use(express.json());

// Routes
router.post('/login', isValidLoginMw, authenCtrl.login);
router.post('/signup', isValidSignupMw, authenCtrl.signup);
router.post('/resetpass', isValidResetPasswordMw, authenCtrl.resetPassword);

export default router;