import express from "express"
import userController from "../controllers/users.js"
const userRouter = express.Router()

userRouter.get('/', userController.getAllUsers)
userRouter.get('/id/:id', userController.getUserById)
userRouter.patch('/update', userController.updateUser)
userRouter.delete('/destroy/:id', userController.deleteUser)
userRouter.post('/register', userController.addUser)
userRouter.post('/login', userController.loginUser)
userRouter.post('/add/address', userController.addAddress)

export default userRouter