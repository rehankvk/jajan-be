import Sequelize from "sequelize"

const db = new Sequelize("shop", "root", "", {
    // host: "https://kailash.iixcp.rumahweb.net:2083/cpsess5735686201/3rdparty/phpMyAdmin/index.php",
    host: "localhost",
    dialect: "mysql"
})

try {
    await db.authenticate();
    console.log('Connection has been established successfully.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
export default db