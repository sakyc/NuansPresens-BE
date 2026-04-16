import db from "../../../config/db.js";
import { DataTypes } from "sequelize";

const FlexibilityItem = db.define('katalog_items', {
    item_nama: {
        type: DataTypes.STRING,
        allowNull: false
    },
    proteksi_menit: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    item_deskripsi: {
        type: DataTypes.STRING,
        allowNull: false
    },
    item_harga: {
        type: DataTypes.INTEGER,
        allowNull: false 
    },
    icon: {
        type: DataTypes.STRING, 
        allowNull: true,
        defaultValue: null
    },
    type_stock: {
        type: DataTypes.ENUM('GLOBAL', 'PER_USER'),
        allowNull: false,
        defaultValue: 'PER_USER'
    },
    stok_limit: {
        type: DataTypes.INTEGER,
        allowNull: true,
        defaultValue: 10
    }
},);

export default FlexibilityItem;