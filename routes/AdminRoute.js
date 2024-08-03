import express from 'express';
import { createAdminRecord } from '../controllers/Admin.js';
import { verifyUser, adminOnly } from "../middleware/AuthUser.js";

const router = express.Router();

router.post('/admin', verifyUser, adminOnly, createAdminRecord);


export default router;