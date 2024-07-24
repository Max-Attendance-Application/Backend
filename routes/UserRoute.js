import express from 'express';
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    uploadProfileImage,
    handleFileUpload,
    deleteUserById,
    forgotPassword,
    resetPassword
} from "../controllers/Users.js";
import {verifyUser, adminOnly, } from "../middleware/AuthUser.js";
import { uploadSingleProfileimg } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUser);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', createUser);
router.post('/uploadProfileImage', verifyUser, handleFileUpload,uploadProfileImage, uploadSingleProfileimg,  );
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUserById);

router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password/', resetPassword); // This route requires user to be logged in

export default router;