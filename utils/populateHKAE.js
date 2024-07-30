import moment from 'moment';
import UserModel from '../models/UserModel.js';  // Ensure '.js' is included
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

    for (const user of users) {
      const hkaValue = adminRecord ? adminRecord.HKA : null;

      await HKAEModel.create({
        userId: user.id,
        HKA: hkaValue,
        HKE: null // Set HKE as null or some default value if needed
      });
    }

    console.log('HKAE table populated successfully');
  } catch (error) {
    console.error('Error populating HKAE table:', error);
  }
};