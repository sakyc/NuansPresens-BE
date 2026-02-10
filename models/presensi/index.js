import db from "../../config/db.js";
import { DataTypes } from "sequelize";
import karyawan from "../karyawan/index.js";

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
    keterlambatan: {
        type: DataTypes.ENUM('tepat waktu', 'terlambat'),
        allowNull: true
    }
})

export default Presensi