import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let User = db.define('users', {
    username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('admin', 'karyawan', 'manager'),
        allowNull: false
    }
    
})

export default User