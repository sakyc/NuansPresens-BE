import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Qr_absensi = db.define('qr_absensi', {
    code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    
    status: {
        type: DataTypes.ENUM('aktif', 'non-aktif'),
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('masuk', 'keluar'),
        allowNull: false
    },
    shift_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'shifts',
            key: 'id'
        }
    }
    
})

export default Qr_absensi