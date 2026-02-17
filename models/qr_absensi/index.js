import db from "../../config/db.js";
import { DataTypes } from "sequelize";

let Qr_absensi = db.define('qr_absensi', {
    token: {
        type: DataTypes.STRING,
        allowNull: false
    },
    type: {
        type: DataTypes.ENUM('masuk', 'keluar'),
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM('aktif', 'non-aktif'),
        allowNull: false
    },
    
    
})

export default Qr_absensi