import express from 'express';
import { createAdminRecord, getAllAdminRecords, getAdminRecordsByDateRange } from '../controllers/Admin.js';
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/admin', verifyUser, adminOnly, createAdminRecord);
router.get('/allrecord', verifyUser, adminOnly, getAllAdminRecords);
router.get('/allrecordbydate', verifyUser, adminOnly, getAdminRecordsByDateRange);


export default router;