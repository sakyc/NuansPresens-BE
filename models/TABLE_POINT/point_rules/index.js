import db from "../../../config/db.js";
import { DataTypes } from "sequelize";

const PointRule = db.define('point_rules', {
    nama_aturan: {
        type: DataTypes.STRING,
        allowNull: false
    },
    operator: {
        type: DataTypes.ENUM('>', '<', '=', '>=', '<=', "ALFA"), 
        allowNull: false
    },
    kondisi_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    point_value: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
},);

export default PointRule;