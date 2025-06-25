import type { NextFunction, Request, Response } from 'express';
import Product from '../../models/product'; // Đường dẫn tuỳ thuộc cấu trúc dự án của bạn
import type { IProduct } from '../../interfaces/product';
import ErrorRes from '../../models/errorRes';
import { IProdError } from '../../interfaces/response/error/prodError';


// 📘 GET /products - Lấy tất cả sản phẩm
async function getAllProducts(req: Request, res: Response, next: NextFunction) {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        next(err)
    }
};


// 📘 GET /products/:id - Lấy sản phẩm theo ID
async function getProductById(req: Request, res: Response, next: NextFunction) {
    try {
        const product = await Product.findById(req.params.id);
        if (!product)
            throw new ErrorRes<IProdError>('Not Found', 404, { notFound: `Not found product with id: "${req.params.id}"` });
        res.json(product);
    } catch (err) {
        next(err)
    }
};


// 📝 POST /products - Tạo mới sản phẩm
async function createProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const imgUrlsObj: Record<string, string> = {}
        const files = req.files as Express.Multer.File[]
        files.forEach((i, index) => {
            imgUrlsObj[`img${index + 1}`] = i.path.replace('public', '')
        })

        const data: IProduct = { ...req.body, ...imgUrlsObj };
        const newProduct = new Product(data);
        const saved = await newProduct.save();
        res.status(201).json(saved);
    } catch (err) {
        next(err)
    }
};


// ✏️ PUT /products/:id - Cập nhật sản phẩm
async function updateProduct(req: Request, res: Response, next: NextFunction) {
    try {
        if (!req.params.id)
            throw new ErrorRes<IProdError>('Bad Request', 422, { prodId: 'ProductId param is required' });

        const updated = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated)
            throw new ErrorRes<IProdError>('Not Found', 404, { notFound: `Not found product with id: "${req.params.id}"` });

        res.json(updated);
    } catch (err) {
        next(err)
    }
};


// ❌ DELETE /products/:id - Xoá sản phẩm
async function deleteProduct(req: Request, res: Response, next: NextFunction) {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted)
            throw new ErrorRes<IProdError>('Not Found', 404, { notFound: `Not found product with id: "${req.params.id}"` });
        res.json({ message: `Deleted product with id:"${req.params.id}"` });
    } catch (err) {
        next(err)
    }
};


const AdminProductCtrl = {
    getAllProducts, getProductById, createProduct, updateProduct, deleteProduct
}

export default AdminProductCtrl