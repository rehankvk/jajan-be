import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Products = db.define('products',
    {
        // id: DataTypes.STRING,
        title: DataTypes.STRING,
        price: DataTypes.FLOAT,
        description: DataTypes.STRING,
        category: DataTypes.STRING,
        image: DataTypes.STRING,
        rating: DataTypes.FLOAT,
        stock: DataTypes.INTEGER,
    },
)

export default Products