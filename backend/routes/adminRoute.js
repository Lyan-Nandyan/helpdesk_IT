import express from 'express';
import { adminRoleController, userInfo } from '../controllers/adminRoleController.js';
import { authenticate, authorizeRoles } from '../middleware/auth.js';

const router = express.Router();
router.get('/admin/data', authenticate, authorizeRoles('admin'), adminRoleController);
router.get('/user/info', authenticate, authorizeRoles('admin'), userInfo);

export default router;