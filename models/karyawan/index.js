import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let karyawan = db.define('karyawan', {
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
    },
    divisi_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'divisis',
            key: 'id'
        }
    },
    jabatan_id:{
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'jabatans',
            key: 'id'
        }
    },
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nip: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    no_hp: {
        type: DataTypes.STRING,
        allowNull: false
    },
    foto:{
        type: DataTypes.STRING,
        allowNull: false
    },
    gender:{
        type: DataTypes.STRING,
        allowNull: false
    },
})

export default karyawan