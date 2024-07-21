import { DataTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import Users from "./UserModel.js";

// Define the AbsenModel with an id field as primary key
const AbsenModel = db.define('AbsenModel', {
    id: {
        type: DataTypes.INTEGER, // Use INTEGER for auto-increment primary key
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
    },
    uuid: {
        type: DataTypes.UUID, // Use UUID for unique identifier
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
    tapin: {
        type: DataTypes.DATE, // Use DATE for datetime values
        allowNull: false,
        validate: {
            notEmpty: true,
            isDate: true
        }
    },
    tapout: {
        type: DataTypes.DATE, // Use DATE for optional datetime values
        allowNull: true,
        validate: {
            isDate: true
        }
    },
    photo: {
        type: DataTypes.STRING, // Use BLOB for binary data
        allowNull: false,
        // Add additional validation if needed
    },
    userId: {
        type: DataTypes.INTEGER, // Use INTEGER if userId is an integer
        allowNull: false,
        validate: {
            notEmpty: true
        }
    },
}, {
    freezeTableName: true
});

// Define associations
Users.hasMany(AbsenModel, { foreignKey: 'userId' });
AbsenModel.belongsTo(Users, { foreignKey: 'userId' });

export default AbsenModel;
