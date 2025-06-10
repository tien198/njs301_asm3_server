import express, { Router } from 'express';
import authenCtrl from '../controllers/authen';
import { LoginValidatorMw, ResetPasswordValidatorMw, SignupValidatorMw } from '../middlewares/validate/auth';

const router = Router();

router.use(express.json());

// Routes
router.post('/login', LoginValidatorMw, authenCtrl.login);
router.post('/signup', SignupValidatorMw, authenCtrl.signup);
router.post('/resetpass', ResetPasswordValidatorMw, authenCtrl.resetPassword);

export default router;