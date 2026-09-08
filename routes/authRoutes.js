import express from 'express';
import {register, login, logout} from '../controllers/authController.js'
import { userLists } from '../controllers/userController.js';
import {authenticateToken, authorizeRoles} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Any logged-in user
router.get(
    '/profile',
    authenticateToken,
    (req, res) => {

        res.json({
            success: true,
            message: 'Profile accessed successfully',
            user: req.user
        });

    }
);

// User + Admin
router.get(
    '/user-area',
    authenticateToken,
    authorizeRoles('user', 'admin'),
    (req, res) => {

        res.json({
            success: true,
            message: 'User area accessed',
            user: req.user
        });

    }
);

// Admin only
router.get(
    '/admin',
    authenticateToken,
    authorizeRoles('admin'),
    (req, res) => {

        res.json({
            success: true,
            message: 'Welcome Admin',
            user: req.user
        });

    }
);

// User List
router.get(
    '/user',
    authenticateToken,
    userLists
);

// Logout
router.post(
    '/auth/logout',
    authenticateToken,
    logout
);

export default router;