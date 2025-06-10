import express, { Router } from 'express';
import shopCtrl from '../controllers/shop.js';
import { isAuthMw } from '../middlewares/identityMw.js';

// validator Mw
import { addToCartValidatorMw } from '../middlewares/validate/shop.js';

const router = Router();

router.use(express.json())

router.get('/products', shopCtrl.getProducts);
router.get('/product/:id', shopCtrl.getProductById);
// find relevant products
router.post('/find-by-category', shopCtrl.getProductByCategory);
// add to cart
router.use(isAuthMw)
router.post('/add-to-cart', addToCartValidatorMw, shopCtrl.addToCart);
router.get('/cart', shopCtrl.getCart);
router.post('/create-order', shopCtrl.createOrder);

export default router; 