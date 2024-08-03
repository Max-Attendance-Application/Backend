import AdminModel from '../models/AdminModel.js';
import HKAEModel from '../models/HKAEModel.js'; // Import the HKAE model
import { updateHKAE } from '../utils/cronJob.js';
import moment from 'moment';

export const createAdminRecord = async (req, res) => {
    const { Tahun, Bulan, HKA, Jumlah, TanggalHariLibur } = req.body;

    console.log('Request Body:', req.body); // Debug statement

    try {
        // Calculate the number of days remaining in the current month
        const today = moment();
        const daysInMonth = today.daysInMonth();
        const currentDay = today.date();
        const maxHKA = daysInMonth - currentDay; // Maximum allowed HKA value

        // Validate HKA
        if (HKA > maxHKA) {
            return res.status(400).json({ message: `HKA cannot exceed ${maxHKA} days remaining in the current month.` });
        }

        // Ensure TanggalHariLibur is an array and sort it
        const holidays = Array.isArray(TanggalHariLibur) ? TanggalHariLibur.map(Number) : [Number(TanggalHariLibur)];
        holidays.sort((a, b) => a - b); // Sort in ascending order

        // Calculate the number of holidays
        const jumlahLibur = holidays.length;

        // Check for existing record with the same Tahun and Bulan
        const existingRecord = await AdminModel.findOne({
            where: {
                Tahun,
                Bulan
            }
        });

        if (existingRecord) {
            return res.status(400).json({ message: 'Tahun dan Bulan Sudah Ada.' });
        }

        // Create the Admin record with the sorted holidays and the number of holidays
        const newAdminRecord = await AdminModel.create({
            Tahun,
            Bulan,
            HKA,
            Jumlah: jumlahLibur, // Set Jumlah as the count of holidays
            TanggalHariLibur: holidays // Save sorted holidays
        });

        updateHKAE();

        res.status(201).json(newAdminRecord);
    } catch (error) {
        console.error('Error creating Admin record:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};