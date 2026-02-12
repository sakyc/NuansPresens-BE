import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Divisi = db.define('divisi',{
    nama_divisi: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Divisi