import { DataTypes } from "sequelize";
import db from "../../../config/db.js";

let penilaian = db.define('penilaian', {
    atasan_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'karyawans',
            key: 'id'
        },
    },
    karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'karyawans',
            key: 'id'
        },
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    priode: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'priode_penilaians', 
            key: 'id'
        },
    },
    catatan: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default penilaian