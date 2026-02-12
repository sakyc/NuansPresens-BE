import { Sequelize } from "sequelize";

const db = new Sequelize('test_absensi_final', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

export default db;

