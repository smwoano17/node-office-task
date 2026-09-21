import express from 'express';
import {register, login, logout} from '../controllers/authController.js'
import { userLists, createUser, updateUser, deleteUser, viewUser } from '../controllers/userController.js';
import { roleLists, createRole, updateRole, deleteRole } from '../controllers/roleController.js';
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
// router.get(
//     '/user-area',
//     authenticateToken,
//     authorizeRoles('user', 'admin'),
//     (req, res) => {

//         res.json({
//             success: true,
//             message: 'User area accessed',
//             user: req.user
//         });

//     }
// );

// Admin only
// router.get(
//     '/admin',
//     authenticateToken,
//     authorizeRoles('admin'),
//     (req, res) => {

//         res.json({
//             success: true,
//             message: 'Welcome Admin',
//             user: req.user
//         });

//     }
// );

router.use(authenticateToken);

// Dashboard
router.get('/dashboard', authorizeRoles, userLists);

// User routes
router.get('/users', authorizeRoles, userLists);
router.post('/users/store', authorizeRoles, createUser);
router.get('/users/show/:id', authorizeRoles, viewUser);
router.put('/users/update/:id', authorizeRoles, updateUser);
router.delete('/users/delete/:id', authorizeRoles, deleteUser);

// Role routes
router.get('/roles', roleLists);
router.post('/roles/store', createRole);
router.put('/roles/update/:id', updateRole);
router.delete('/roles/delete/:id', deleteRole);

// Logout
router.post('/auth/logout', logout);

export default router;