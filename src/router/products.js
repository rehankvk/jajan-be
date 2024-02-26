import express from "express"
import productController from "../controllers/products.js"
const productRouter = express.Router()

productRouter.get('/', productController.getAllProducts)
productRouter.get('/id/:id', productController.getProductById)
productRouter.get('/category/:category', productController.getProductsByCategory)
productRouter.get('/search', productController.searchProduct)
productRouter.post('/', productController.addProducts)
productRouter.delete('/destroy/:id', productController.deleteProduct)

export default productRouter


