import express, { Router } from 'express';
import shopCtrl from '../controllers/shop.js';
import { isAuthMw } from '../middlewares/identityMw.js';

const router = Router();

router.use(express.json())

router.get('/', shopCtrl.getProducts);
router.get('/:id', shopCtrl.getProductById);
// find relevant products
router.post('/find-by-category', shopCtrl.getProductByCategory);
// add to cart
router.use(isAuthMw)
router.post('/add-to-cart', shopCtrl.addToCart);
router.post('/create-order', shopCtrl.createOrder);

export default router; 