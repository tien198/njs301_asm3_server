import { Router } from 'express';
import shopCtrl from '../controllers/shop.js';

const router = Router();

router.get('/', shopCtrl.getProducts);
router.get('/:id', shopCtrl.getProductById);

export default router; 