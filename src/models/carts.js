import { DataTypes } from "sequelize"
import db from "../config/db.js"
import Users from "./users.js"
import Products from "./products.js"

const Carts = db.define('carts', {
    user_id: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
            model: Users,
            key: "id"
        }
    },
    products_id: {
        allowNull: false,
        type: DataTypes.STRING,
        references: {
            model: Products,
            key: "id"
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
})

Carts.belongsTo(Products, { foreignKey: 'products_id' })
Carts.belongsTo(Users, { foreignKey: 'user_id' })

export default Carts