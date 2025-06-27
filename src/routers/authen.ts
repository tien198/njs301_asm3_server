import express, { Router } from 'express';
import AuthCtrl from '../controllers/authen';
import { LoginValidatorMw, ResetPasswordValidatorMw, SignupValidatorMw } from '../middlewares/validate/auth';
import { isAdmin } from '../middlewares/identityMw';

const router = Router();

router.use(express.json());

// Check whether user is admin
router.get('/is-admin', isAdmin, AuthCtrl.isAdmin)
router.get('/status', AuthCtrl.getAuthStatus);

// Routes
router.post('/login', LoginValidatorMw, AuthCtrl.login);
router.post('/signup', SignupValidatorMw, AuthCtrl.signup);
router.post('/logout', AuthCtrl.logout);
router.post('/resetpass', ResetPasswordValidatorMw, AuthCtrl.resetPassword);

export default router;