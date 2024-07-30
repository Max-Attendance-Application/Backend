import moment from 'moment';
import UserModel from '../models/UserModel.js';
import HKAEModel from '../models/HKAEModel.js';
import AdminModel from '../models/AdminModel.js';

export const populateHKAE = async () => {
    const now = moment();
    const currentYear = now.year();
    const currentMonth = now.format('MMMM');

    try {
        const adminRecord = await AdminModel.findOne({
            where: {
                Tahun: currentYear,
                Bulan: currentMonth
            }
        });

        const users = await UserModel.findAll();
        let recordsCreated = false; // Flag to check if any record is created

        for (const user of users) {
            // Check if record already exists
            const existingRecord = await HKAEModel.findOne({
                where: {
                    userId: user.id
                }
            });

            if (!existingRecord) {
                // Record does not exist, create a new one
                const hkaValue = adminRecord ? adminRecord.HKA : null;

                await HKAEModel.create({
                    userId: user.id,
                    HKA: hkaValue,
                    HKE: null // Set HKE as null or some default value if needed
                });

                recordsCreated = true; // Set flag to true
            }
        }

        if (recordsCreated) {
            console.log('HKAE table populated successfully');
        } else {
            console.log('All records in HKAE table already exist');
        }
    } catch (error) {
        console.error('Error populating HKAE table:', error);
    }
};