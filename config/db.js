import { Sequelize } from "sequelize";

const db = new Sequelize('nuanpresens_app', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;

