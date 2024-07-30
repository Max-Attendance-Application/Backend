import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    port: process.env.DB_PORT,
    logging: false,
});

const resetAutoIncrement = async () => {
    try {
        // Check if the table exists
        const [tables] = await db.query(
            "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'AbsenModel';"
        );

        if (tables.length > 0) {
            // The table exists, reset auto-increment
            await db.query('ALTER SEQUENCE "AbsenModel_id_seq" RESTART WITH 1;');
            console.log('Auto-increment reset successfully.');
        } else {
            console.log('Table "AbsenModel" does not exist.');
        }
    } catch (error) {
        console.error('Error checking table existence or resetting auto-increment:', error);
    }
};

export default db;