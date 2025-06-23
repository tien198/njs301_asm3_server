import { Router } from 'express';
import AdminCtrl from '../controllers/admin';
import { isAuthMw } from '../middlewares/identityMw';
import { createProductValidatorMw, productIdValidatorMw, updateProductValidatorMw } from '../middlewares/validate/admin';

const router = Router();

router.use(isAuthMw)


// Amdmin Products
router.get('/products', AdminCtrl.getAllProducts);
router.get('/products/:id', productIdValidatorMw, AdminCtrl.getProductById);
router.post('/products', createProductValidatorMw, AdminCtrl.createProduct);
router.put('/products/:id', updateProductValidatorMw, AdminCtrl.updateProduct);
router.delete('/products/:id', productIdValidatorMw, AdminCtrl.deleteProduct);

// Admin Orders
router.get('/orders', AdminCtrl.getOrders);
router.get('/orders/:id', AdminCtrl.getOrderById);

// Admin Statistic
router.get('/user-count', AdminCtrl.getUserCount)
router.get('/order-count', AdminCtrl.getOrderCount)


export default router;
