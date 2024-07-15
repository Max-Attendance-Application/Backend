import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

// Hapus baris ini karena DataTypes sudah ada di dalam objek Sequelize
// const { DataTypes } = Sequelize;

const AbsenModel = db.define('AbsenModel', {
    uuid:{
        type: DataTypes.STRING, // Gunakan DataTypes di sini
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tapin:{
        type: DataTypes.DATE, // Gunakan DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    tapout:{
        type: DataTypes.DATE, // Gunakan DataTypes di sini
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    photo: {
        type: DataTypes.BLOB, // Gunakan DataTypes di sini
        allowNull: false,
        // Jika Anda ingin menambahkan validasi tambahan, Anda bisa menambahkannya di sini
    },
    userId:{
        type: DataTypes.INTEGER, // Gunakan DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },

}, {
    freezeTableName: true
});

Users.hasMany(AbsenModel);
AbsenModel.belongsTo(Users, {foreignKey: 'userId'});

export default AbsenModel;
