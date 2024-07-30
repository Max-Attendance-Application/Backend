import db from "../config/Database.js";
import { Sequelize, DataTypes } from "sequelize";
import Users from "./UserModel.js";

const HKAEModel = db.define('HKAE', {
  id: {
    type: Sequelize.DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: Sequelize.DataTypes.INTEGER,
    references: {
      model: Users,
      key: 'id'
    },
    unique: true // Ensure one-to-one relationship
  },
  HKA: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true
  },
  HKE: {
    type: Sequelize.DataTypes.INTEGER,
    allowNull: true
  }
}, {
  freezeTableName: true // Prevents Sequelize from pluralizing the table name
});

Users.hasOne(HKAEModel, { foreignKey: 'userId' });
HKAEModel.belongsTo(Users, { foreignKey: 'userId' });

export default HKAEModel;