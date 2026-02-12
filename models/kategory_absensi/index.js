import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Kategory_absen = db.define('kategory_absensi', {
    nama_kategory: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Kategory_absen