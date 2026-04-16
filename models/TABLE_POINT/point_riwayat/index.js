import db from "../../../config/db.js";
import { DataTypes } from "sequelize";

const PointRiwayat = db.define('point_riwayats', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users',
            key: 'id'
        }
    },
    type_transaksi: {
        type: DataTypes.ENUM('REWARD', 'SPEND', 'PENALTY'), 
        allowNull: false
    },
    jumlah_point: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    point_saat_ini: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    keterangan: { 
        type: DataTypes.STRING,
        allowNull: true
    }
    
}, );

export default PointRiwayat;