// import { v4 as uuidv4 } from "uuid"
import { createUUID } from "../middleware/uuid.js";
import Products from "../models/products.js";
import { Op } from "sequelize"

const productController = {
    getAllProducts: async (req, res) => {
        try {
            const products = await Products.findAll()
            if (!products || products.length === 0) {
                res.status(404).json({ message: "Tidak Ada Data Produk" });
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Semua Data Produk`, totalProducts: products.length, products });
            }
        } catch (error) {
            console.error(error)
        }
    },
    getProductById: async (req, res) => {
        const id = req.params.id
        const products = await Products.findByPk(id)
        try {
            if (!products || products.length === 0) {
                res.status(404).json({ message: "Tidak Ada Data Produk" });
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Data Produk Dengan Id = ${id}`, products });
            }
        } catch (error) {
            console.error(error)
        }
    },
    getProductsByCategory: async (req, res) => {
        const category = req.params.category;
        const products = await Products.findAll({
            where: {
                category: category
            }
        })
        try {
            if (!products || products.length === 0) {
                res.status(404).json({ message: "Tidak Ada Data Produk" });
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Data Produk Dengan Category = ${category}`, products });
            }
        } catch (error) {
            console.error(error)
        }
    },
    searchProduct: async (req, res) => {
        const query = req.query.query
        let whereCondition = {};

        if (query) {
            const pattern = `%${query.toLowerCase()}%`;
            whereCondition = {
                title: {
                    [Op.like]: pattern
                }
            };
        }

        try {
            const products = await Products.findAll({
                where: whereCondition
            });
            if (!products || products.length === 0) {
                res.status(404).json({ message: "Tidak Ada Data Produk" });
            } else {
                res.status(200).json({ message: `Berhasil Mengambil Semua Data Produk Dengan Query = ${query}`, products });
            }
        } catch (error) {
            console.error(error)
        }
    },
    addProducts: async (req, res) => {
        const id = createUUID()
        const { title, price, description, category, image, rating, stock } = req.body
        try {
            const products = await Products.create({
                id: id,
                title: title,
                price: price,
                description: description,
                category: category,
                image: image,
                rating: rating,
                stock: stock
            })
            res.status(200).json({ message: "Berhasil Membuat Produk Baru", products })
        } catch (error) {
            console.error(error)
        }
    },
    updateProduct: async (req, res) => {
        const id = req.params.id
    },
    deleteProduct: async (req, res) => {
        const id = req.params.id

        try {
            const products = await Products.destroy({
                where: {
                    id: id
                }
            })
            if (!id) {
                res.status(404).json({ message: "Tidak Ada Barang Dengan id Tersebut" })
            } else {
                res.status(200).json({ message: "Berhasil Menghapus Barang", products })
            }
        } catch (error) {
            console.error(error)
        }
    }
}

export default productController