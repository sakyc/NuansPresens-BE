import { DataTypes } from "sequelize";
import db from "../../../config/db.js";

let priodePenilaian = db.define('priode_penilaian',{
    nama_priode: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    tahun: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    bulan: {
        type: DataTypes.INTEGER, 
        allowNull: false,
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('aktif', 'selesai')
    },
    created_by: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        },
    }


})

export default priodePenilaian