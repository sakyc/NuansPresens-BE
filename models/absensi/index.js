import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Absensi = db.define('absensi', {
    karyawan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'karyawans',
            key: 'id'
        }
    },
    id_karyawan: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kategory_absensis',
            key: 'id'
        }
    },
    tanggal: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    kode: {
        type: DataTypes.STRING
    },
    status: {
        type: DataTypes.ENUM('pending', 'di setujui', 'di tolak'),
        allowNull: false
    },
    keterangan: {
        type: DataTypes.STRING,
        allowNull: true
    },
    foto: {
        type: DataTypes.STRING,
        allowNull: true
    },
    alasan_ditolak: {
        type: DataTypes.STRING,
        allowNull: true
    }
})

export default Absensi
