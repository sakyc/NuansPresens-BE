import { DataTypes } from "sequelize";
import db from "../../../config/db.js";

let detailPenilaian = db.define("detail_penilaian",{
    penilaian_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'penilaians',
            key: 'id'
        },
    },
    kategori_penilaian_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'kategori_penilaians',
            key: 'id'
        },
    },
    poin: {
        type: DataTypes.INTEGER,
        allowNull: false
    }

})

export default detailPenilaian