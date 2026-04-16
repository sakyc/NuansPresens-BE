import db from "../../../config/db.js";
import { DataTypes } from "sequelize";

const UserToken = db.define('user_tokens', {
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'users', 
            key: 'id'
        }
    },
    item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'katalog_items',
            key: 'id'
        }
    },
    status: {
        type: DataTypes.ENUM('AKTIF', 'TELAH DIGUNAKAN', 'EXPIRED'),
        allowNull: false,
        defaultValue: 'AKTIF'
    },
    used_at_attendance_id: {
        type: DataTypes.INTEGER,
        allowNull: true, 
        references: {
            model: 'presensis',  
            key: 'id'
        }
    },
    expired_date: {
        type: DataTypes.DATE,
        allowNull: false 
    }, 
    icon: {
        type: DataTypes.STRING,
        allowNull: true
    }
},);

export default UserToken;