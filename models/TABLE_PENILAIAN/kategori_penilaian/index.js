import { DataTypes } from "sequelize";
import db from "../../../config/db.js";

let kategoryPenilaian = db.define('kategori_penilaian', {
    nama_kategori: {
        type: DataTypes.STRING,
        allowNull: false
    },
    deskripsi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("aktif", "tidak-aktif"),
        allowNull: false
    }
})


export default kategoryPenilaian