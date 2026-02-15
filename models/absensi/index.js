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
    kategori_absensi_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kategori_absensis',
            key: 'id'
        }
    },
    tanggal_mulai: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    tanggal_selesai: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('pending', 'disetujui', 'ditolak'),
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
    },
    verified_by: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'users',
            key: 'id'

        }
    }
})
 
export default Absensi
