import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Presensi = db.define('presensi', {
    karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'karyawans',
            key: 'id'
        },
    },
    shift_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'shifts',
            key: 'id'
        }
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    jam_masuk: {
        type: DataTypes.TIME,
        allowNull: true
    },
    jam_keluar: {
        type: DataTypes.TIME,
        allowNull: true
    },
    status_kehadiran: {
        type: DataTypes.ENUM('tepat waktu', 'terlambat'),
        allowNull: true
    }
},{
    indexes: [
        {
            unique: true,
            fields: ['karyawan_id', 'tanggal']
        }
    ]
})

export default Presensi