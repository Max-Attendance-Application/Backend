import express from 'express';
import {
    getaAbsen,
    getAbsens,
    getAbsenbyId,
    getAbsenByName,
    createAbsenTapin,
    createAbsenTapout,
    updateAbsen,
    deleteAbsen
} from "../controllers/absen.js";
import { uploadSingle } from '../middleware/uploadMiddleware.js';
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/absen', verifyUser,adminOnly, getaAbsen);
router.get('/absens', verifyUser,adminOnly,getAbsens); //fix
router.get('/absen/:id', verifyUser, adminOnly, getAbsenbyId);
router.get('/absenbyname/:name', verifyUser, adminOnly, getAbsenByName);
router.post('/absen/in', verifyUser, uploadSingle, createAbsenTapin);
router.post('/absen/out', verifyUser, uploadSingle, createAbsenTapout);
router.patch('/absen/:id', verifyUser, updateAbsen);
router.delete('/absen/:id', verifyUser, deleteAbsen);




export default router