import cron from 'node-cron';
import AdminModel from '../models/AdminModel.js';
import HKAEModel from '../models/HKAEModel.js';
import moment from 'moment';
import { Op, Sequelize } from 'sequelize';

// Function to get month name from index
const getMonthName = (index) => {
    const months = [
        'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
        'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    return months[index];
};

// Function to update HKAE table
export const updateHKAE = async () => {
    const currentYear = moment().year();
    const currentMonthIndex = moment().month(); // 0-based index for months

    // Convert the current month index to month name
    const currentMonthName = getMonthName(currentMonthIndex);

    console.log('Running updateHKAE at', moment().format('YYYY-MM-DD HH:mm:ss'));

    try {
        // Find the Admin record for the current year and month
        const adminRecord = await AdminModel.findOne({
            where: {
                Tahun: `${currentYear}`, // Cast to string
                Bulan: currentMonthName // Use month name
            }
        });

        if (adminRecord) {
            console.log('Updating HKAE records with HKA:', adminRecord.HKA);

            // Update all HKAE records
            await HKAEModel.update(
                { HKA: adminRecord.HKA },
                { where: {} } // Empty where clause to update all records
            );

            // Check if HKA equals HKE and clear both if they match
            await HKAEModel.update(
                { HKA: null, HKE: null },
                {
                    where: {
                        HKA: { [Op.eq]: Sequelize.col('HKE') }
                    }
                }
            );

            console.log('HKAE records updated and cleared where HKA equals HKE');
        } else {
            console.log('No Admin record found for current year and month.');
        }
    } catch (error) {
        console.error('Error updating HKAE records:', error);
    }
};

// Schedule the updateHKAE function to run at midnight on the 1st of every month
cron.schedule('0 0 1 * *', updateHKAE);

console.log('Cron job scheduled to run on the 1st of every month at midnight');


export const updateAdminHKE = async () => {
    const currentYear = moment().year();
    const currentMonthIndex = moment().month(); // 0-based index for months

    // Convert the current month index to month name
    const currentMonthName = getMonthName(currentMonthIndex);

    console.log('Running updateAdminHKE at', moment().format('YYYY-MM-DD HH:mm:ss'));

    try {
        // Find the Admin records for the current year and month
        const adminRecords = await AdminModel.findAll({
            where: {
                Tahun: currentYear,
                Bulan: currentMonthName
            }
        });

        if (adminRecords.length > 0) {

            for (const record of adminRecords) {
                if (record.HKE < record.HKA) {
                    // Increment HKE by 1
                    record.HKE += 1;
                    await record.save();
                    console.log(`HKE incremented to ${record.HKE} for No ${record.No}`);
                    console.log('Admin records updated where HKA and HKE are different.');
                } else if (record.HKE >= record.HKA) {
                    console.log(`HKE is already at or above the maximum value (HKA) for No ${record.No}`);
                }
            }

        } else {
            console.log('No Admin records found for current year and month.');
        }
    } catch (error) {
        console.error('Error updating Admin records:', error);
    }
};

// Schedule the cron job to run every midnight
cron.schedule('0 0 * * *', updateAdminHKE)
