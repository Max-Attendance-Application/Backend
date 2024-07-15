import moment from 'moment-timezone';
import AbsenModel from "../models/AbsenModel.js";
import UserModel from "../models/UserModel.js";

export const getaAbsen = async (req, res) => {
    try {
        let response;
        if(req.role === 'admin'){
            response = await AbsenModel.findAll({
                include:[{
                    model:UserModel
                }]
            });
        }else{
            response = await AbsenModel.findAll({
                where:{
                    userId: req.userId
                },
                include:[{
                    model:UserModel
                }]
            });
        }
        res.status(200).json(response);
    } catch (error) {
        res.status(500).json({msg: error.message});
    }
}

export const getAbsenbyId = async (req, res) => {

}

export const createAbsenTapin = async (req, res) => {
    const photo = req.file; // Assuming you're using multer for file upload
    const tapin = moment().tz('Asia/Jakarta').format(); // Menggunakan waktu saat ini untuk tap in

    if (!photo) {
        return res.status(400).json({ message: "Photo is required" });
    }

    try {
        const user = await UserModel.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const newAbsen = await AbsenModel.create({
            userId: req.userId,
            photo: photo.buffer, // Storing the photo as a buffer
            tapin,
            tapout: null
        });

        // Format tapin dan updatedAt sebelum dikirimkan sebagai respons
        const formattedAbsen = {
            id: newAbsen.id,
            userId: newAbsen.userId,
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
                tapout: null // Mencari record tap in yang belum tap out
            }
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
