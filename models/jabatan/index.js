import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Jabatan = db.define('jabatan', {
    nama_jabatan: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Jabatan