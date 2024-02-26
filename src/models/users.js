import { DataTypes } from "sequelize"
import db from "../config/db.js"

const Users = db.define('users',
    {
        // id: DataTypes.STRING,
        username: DataTypes.STRING,
        email: DataTypes.STRING,
        password: DataTypes.STRING
    }
)

export default Users
