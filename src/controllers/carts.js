import { jwtDecode } from "jwt-decode"
import { createUUID } from "../middleware/uuid.js";
import Carts from "../models/carts.js";
import Products from "../models/products.js";

const cartController = {
    getAllCart: async (req, res) => {
        const token = req.headers.authorization;
        const userId = req.headers.UserId;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const decoded = await jwtDecode(token)
            const user_id = decoded.id
            if (!decoded || !user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const carts = await Carts.findAll({
                where: { user_id },
                include: [
                    { model: Products, attributes: ['id', 'title', 'price', 'image'] }
                ]
            })
            if (!carts || carts.length === 0) {
                res.status(404).json({ message: "Seluruh Data Cart Tidak Ditemukan" })
            } else {
                res.status(200).json({ message: "Berhasil Mengambil Seluruh Data Carts", carts })
            }
        } catch (error) {
            console.error(error)
        }
    },
    getCartById: async (req, res) => {
        const id = req.params.id
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const decoded = await jwtDecode(token)
            const user_id = decoded.id
            if (!decoded || decoded.id !== user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const carts = await Carts.findAll({
                where: { user_id }, // Filter carts by user ID
                include: [
                    { model: Products, attributes: ['id', 'title', 'price', 'image'] }
                ]
            })
            if (!carts || carts.length === 0) {
                res.status(404).json({ message: `Tidak Ada Data Cart Dengan Id = ${id}` })
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Data Cart Dengan Id = ${id}`, carts })
            }
        } catch (error) {
            console.error(error)
        }
    },
    addToCart: async (req, res) => {
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        const { products_id, quantity } = req.body;

        try {
            const decoded = await jwtDecode(token)
            const user_id = decoded.id
            if (!decoded || decoded.id !== user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }

            const cartItem = await Carts.findOne({ where: { user_id, products_id } });
            if (cartItem) {
                await cartItem.update({ quantity: cartItem.quantity + quantity });
                res.status(200).json({ message: "Berhasil Menambahkan Quantity Ke Dalam Carts" })
            } else {
                await Carts.create({ id: createUUID(), user_id: user_id, products_id: products_id, quantity: quantity })
                res.status(200).json({ message: "Berhasil Menambahkan Barang Ke Dalam Carts", cartItem })
            }
        } catch (error) {
            console.error(error);
        }
    },
    updateQty: async (req, res) => {
        const id = req.params.id
        const { newQty, type } = req.body
        try {
            const getCart = await Carts.findByPk(id)

            if (!getCart) {
                return res.status(404).json({ message: "No Cart Found with that ID" })
            }

            let newCartUpdated;
            if (type === "increment") {
                newCartUpdated = await getCart.increment('quantity', { by: newQty })
            } else if (type === "decrement") {
                if (getCart.quantity && newQty <= 1 || newQty === 1) {
                    await getCart.destroy();
                    return res.status(200).json({ message: "Item Successfully Removed from Cart" });
                }
                newCartUpdated = await getCart.decrement('quantity', { by: newQty })
            }

            await newCartUpdated.save()
            await newCartUpdated.reload()
            const message = type === "increment" ? "Quantity Successfully Updated (Increased)" : "Quantity Successfully Updated (Decreased)"
            res.status(200).json({ message })
        } catch (error) {
            console.error(error)
            res.status(500).json({ message: "Internal Server Error" })
        }
    },
    deleteCart: async (req, res) => {
        const id = req.params.id;
        const token = req.headers.authorization;
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ message: 'Forbidden' });
        }
        try {
            const decoded = await jwtDecode(token)
            const user_id = decoded.id
            if (!decoded || decoded.id !== user_id) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const cart = await Carts.findAll({
                where: { user_id }, // Filter carts by user ID
                include: [
                    { model: Products, attributes: ['id', 'title', 'price', 'image'] }
                ]
            })
            if (!cart || cart.length === 0) {
                res.status(404).json({ message: "Cart Dengan Id Tersebut Tidak Ditemukan" })
            } else {
                const cart = await Carts.destroy({
                    where: {
                        id: id
                    }
                })
                res.status(200).json({ message: "Berhasil Menghapus Cart", cart })
            }
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    }

}

export default cartController