import express, { Router } from 'express';
import shopCtrl from '../controllers/shop.js';
import { isAuthMw } from '../middlewares/identityMw.js';

// validator Mw
import { createOrderValidatorMw } from '../middlewares/validate/shop.js';

const router = Router();

router.use(express.json())

router.get('/count-products', shopCtrl.getCountProducts);
router.get('/products', shopCtrl.getProducts);
router.get('/product/:id', shopCtrl.getProductById);
// find relevant products
router.get('/find-by-category/:category', shopCtrl.getProductByCategory);
// add to cart
router.use(isAuthMw)
router.post('/add-to-cart', shopCtrl.addToCart);
router.get('/cart', shopCtrl.getCart);
router.post('/create-order', createOrderValidatorMw, shopCtrl.createOrder);
router.get('/orders', shopCtrl.getOrders);
router.get('/order/:id', shopCtrl.getOrderById);

export default router;