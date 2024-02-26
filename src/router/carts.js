import express from "express"
import cartController from "../controllers/carts.js"
const cartRouter = express.Router()

cartRouter.get('/', cartController.getAllCart)
cartRouter.get('/id/:id', cartController.getCartById)
cartRouter.post('/add', cartController.addToCart)
cartRouter.patch('/update/:id', cartController.updateQty)
cartRouter.delete('/del/:id', cartController.deleteCart)

export default cartRouter