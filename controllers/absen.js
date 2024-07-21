import moment from 'moment-timezone';
import AbsenModel from "../models/AbsenModel.js";
import UserModel from "../models/UserModel.js";

export const getaAbsen = async (req, res) => {
    try {
        let response;{
            response = await AbsenModel.findAll({
                include: [{
            model: UserModel,
            attributes: { exclude: ['password'] } // Exclude the password field
        }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAbsenbyId = async (req, res) => {
    try {
        const absenId = parseInt(req.params.id, 10); // Retrieve and parse the ID from the request parameters

        if (isNaN(absenId)) {
            return res.status(400).json({
                message: 'Invalid ID format'
            });
        }

        const absen = await AbsenModel.findOne({
            where: {
                id: absenId
            },
            include: [{
                model: UserModel,
                attributes: { exclude: ['password'] } // Exclude the password field
            }]
        });

        if (!absen) {
            return res.status(404).json({
                message: 'Absen record not found'
            });
        }

        res.status(200).json(absen);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching absen record',
            error: error.message
        });
    }
};

export const getAbsenByName = async (req, res) => {
    try {
        const { name } = req.params; // Retrieve the user name from request parameters

        if (!name) {
            return res.status(400).json({
                message: 'User name is required'
            });
        }

        // Find the user by name
        const user = await UserModel.findOne({
            where: {
                name: name
            }
        });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Find the absen records for the found user
        const absens = await AbsenModel.findAll({
            where: {
                userId: user.id
            },
            include: [{
                model: UserModel,
                attributes: { exclude: ['password'] } // Exclude the password field
            }]
        });

        if (absens.length === 0) {
            return res.status(404).json({
                message: 'No absen records found for this user'
            });
        }

        res.status(200).json(absens);
    } catch (error) {
        res.status(500).json({
            message: 'Error fetching absen records',
            error: error.message
        });
    }
};


export const createAbsenTapin = async (req, res) => {
    const photo = req.file; // Menggunakan multer untuk upload file
    const tapin = moment().tz('Asia/Jakarta').format(); // Menggunakan waktu saat ini untuk tap in
  
    if (!photo) {
      return res.status(400).json({ message: "Photo is required" });
    }
  
    try {
      const user = await UserModel.findByPk(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
        
      }
  
      /* console.log("Photo URL:", photo.path); // Log URL dari Cloudinary */
      
      const newAbsen = await AbsenModel.create({
        userId: req.userId,
        photo: photo.path, // Menyimpan URL dari Cloudinary
        tapin,
        tapout: null,
      });

      console.log(newAbsen);
  
      // Format tapin dan updatedAt sebelum dikirimkan sebagai respons
      const formattedAbsen = {
        id: newAbsen.id,
        userId: newAbsen.userId,
        photo: newAbsen.photo,
        tapin: moment(newAbsen.tapin).tz('Asia/Jakarta').format(), // Format tapin dalam zona waktu Jakarta
        tapout: newAbsen.tapout ? moment(newAbsen.tapout).tz('Asia/Jakarta').format() : null, // Format tapout jika tidak null dalam zona waktu Jakarta
        createdAt: moment(newAbsen.createdAt).tz('Asia/Jakarta').format(), // Format createdAt dalam zona waktu Jakarta
        updatedAt: moment(newAbsen.updatedAt).tz('Asia/Jakarta').format(), // Format updatedAt dalam zona waktu Jakarta
      };
  
      res.status(201).json({ message: "Tap in successful", data: formattedAbsen });
    } catch (error) {
      res.status(500).json({ message: "Error creating tap in record", error: error.message });
    }
  };
  
  export const createAbsenTapout = async (req, res) => {
    const tapout = moment().tz('Asia/Jakarta').format(); // Menggunakan waktu saat ini untuk tap out
  
    try {
      const absen = await AbsenModel.findOne({
        where: {
          userId: req.userId,
          tapout: null, // Mencari record tap in yang belum tap out
        },
      });
  
      if (!absen) {
        return res.status(404).json({ message: "Tap in record not found or already tapped out" });
      }
  
      absen.tapout = tapout;
      await absen.save();
  
      // Format tapin dan tapout sebelum dikirimkan sebagai respons
      const formattedAbsen = {
        id: absen.id,
        userId: absen.userId,
        tapin: moment(absen.tapin).tz('Asia/Jakarta').format(), // Format tapin dalam zona waktu Jakarta
        tapout: moment(absen.tapout).tz('Asia/Jakarta').format(), // Format tapout dalam zona waktu Jakarta
        createdAt: moment(absen.createdAt).tz('Asia/Jakarta').format(), // Format createdAt dalam zona waktu Jakarta
        updatedAt: moment(absen.updatedAt).tz('Asia/Jakarta').format(), // Format updatedAt dalam zona waktu Jakarta
      };
  
      res.status(201).json({ message: "Tap Out successful", data: formattedAbsen });
    } catch (error) {
      res.status(500).json({ message: "Error creating tap out record", error: error.message });
    }
  };

export const updateAbsen = async (req, res) => {

}

export const deleteAbsen = async (req, res) => {

}
