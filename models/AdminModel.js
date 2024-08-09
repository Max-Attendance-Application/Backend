import { Sequelize, DataTypes } from 'sequelize';
import db from "../config/Database.js";

const AdminModel = db.define('Admin', {
    No: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Tahun: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    Bulan: {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    },
    HKA: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false
    },
    HKE: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    Jumlah: {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: true
    },
    TanggalHariLibur: {
      type: Sequelize.DataTypes.ARRAY(DataTypes.INTEGER),
      allowNull: true
    }
},{
    freezeTableName: true // Prevents Sequelize from pluralizing the table name
  });
  
  export default AdminModel;