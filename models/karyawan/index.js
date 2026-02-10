import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let karyawan = db.define('karyawan', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    shift_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'shifts',
            key: 'id'
        }
    }
})

export default karyawan