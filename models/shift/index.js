import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Shift = db.define('shift', {
    nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    jam_mulai: {
        type: DataTypes.TIME,
        allowNull: false
    },
    jam_selesai: {
        type: DataTypes.TIME,
        allowNull: false
    }
})

export default Shift