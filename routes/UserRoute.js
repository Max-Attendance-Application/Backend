import express from 'express';
import {
    getUser,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    forgotPassword,
    resetPassword
} from "../controllers/Users.js";
import {verifyUser, adminOnly} from "../middleware/AuthUser.js";

const router = express.Router();

router.get('/users', verifyUser, adminOnly, getUser);
router.get('/users/:id', verifyUser, adminOnly, getUserById);
router.post('/users', createUser);
router.patch('/users/:id', verifyUser, updateUser);
router.delete('/users/:id', verifyUser, adminOnly, deleteUser);

router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password/:token', resetPassword); // This route requires user to be logged in

export default router;