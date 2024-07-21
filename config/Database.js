import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT
});

const resetAutoIncrement = async () => {
    try {
        await Sequelize.query('ALTER SEQUENCE "AbsenModel_id_seq" RESTART WITH 1;');

        console.log('Auto-increment reset successfully.');
    } catch (error) {
        console.error('Error resetting auto-increment:', error);
    }
};

export default db;