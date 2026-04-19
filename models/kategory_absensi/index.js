import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Kategory_absen = db.define('kategori_absensi', {
    nama_kategori_absensi: {
        type: DataTypes.ENUM('ALFA', 'IZIN', 'SAKIT', 'CUTI'),
        allowNull: false
    }
})

export default Kategory_absen 