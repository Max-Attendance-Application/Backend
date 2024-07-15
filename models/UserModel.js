import { Sequelize } from "sequelize";
import db from "../config/Database.js";

// Hapus deklarasi ini karena DataTypes sudah ada di dalam objek Sequelize
// const { DataTypes } = Sequelize;

const Users = db.define('users', {
    uuid:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        defaultValue: Sequelize.DataTypes.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    name:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
            len: [3, 100]
        }
    },
    email:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
            isEmail: true
        }
    },
    password:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
            
        }
    },
    username:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: true,
        }
    },
    gender: {
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: {
                args: [['male', 'female']],
                msg: "Gender must be 'male' or 'female' only"
            }
        }
    },
    division:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    position:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
        }
    },
    role:{
        type: Sequelize.DataTypes.STRING, // Gunakan Sequelize.DataTypes di sini
        allowNull: false,
        validate: {
            notEmpty: true,
            isIn: {
                args: [['admin', 'employee']],
                msg: "role must be 'admin' or 'employee' only"
            }
        }
    },

}, {
    freezeTableName: true
});

export default Users;
