import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validatePassword(password) {
    return passwordRegex.test(password);
}

// ===============================
// REGISTER
// ===============================
export const register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body || {};

        if (!name) {
            return res.status(400).json({
                success: false,
                message: 'Name field is required'
            });
        }

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email field is required'
            });
        }

        if (!password) {
            return res.status(400).json({
                success: false,
                message: 'Password field is required'
            });
        }

        // Check existing user
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ?',
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        if (!validatePassword(password)) {
            return res.status(422).json({
                success: false,
                message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Never allow normal registration to create admin accounts
        const userRole = role === 'admin' ? 'user' : (role || 'user');

        const [result] = await pool.execute(
            `INSERT INTO users (name, email, password, role)
             VALUES (?, ?, ?, ?)`,
            [name, email, hashedPassword, userRole]
        );

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            user: {
                id: result.insertId,
                name: name,
                email: email,
                role: userRole
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: JSON.stringify(error)
        });
    }
};

// ===============================
// LOGIN
// ===============================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body || {};

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user
        const [users] = await pool.execute(
            `SELECT id, name, email, password, role
             FROM users
             WHERE email = ?`,
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = users[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // ==========================================
        // CHANGE LOGIN STATUS
        // ==========================================
        await pool.execute(
            `UPDATE users
             SET is_login = 1
             WHERE id = ?`,
            [user.id]
        );

        // ==========================================
        // SEND SOCKET EVENT
        // ==========================================
        const io = req.app.get('io');

        io.emit('user_status_changed', {
            userId: user.id,
            is_login: 1
        });

        // Create JWT
        const token = jwt.sign(
            {
                id : user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRES_IN || '1d'
            }
        );

        const [userRole] = await pool.execute(
            `select role_id from users where id = ?`,
            [user.id]
        );

        const [allMenus] = await pool.execute(
            `SELECT menus.id, menus.parent_id, menus.title, menus.icon, menus.front_route, roles.id as role_id FROM menus
            LEFT JOIN menu_permissions ON menu_permissions.menu_id = menus.id
            LEFT JOIN permissions ON permissions.id = menu_permissions.permission_id
            LEFT JOIN role_permissions ON role_permissions.permission_id = permissions.id
            LEFT JOIN roles ON roles.id = role_permissions.role_id
            WHERE (roles.id = ? OR menus.route IS NULL) AND menus.is_active = ?
            ORDER BY menus.parent_id, menus.sort_order`,
            [userRole[0].role_id, 1]
        );

        const menuTree = [];
        for (const allMenu of allMenus) {
            if (allMenu.parent_id == null) {
                menuTree.push({
                    id: allMenu.id,
                    title: allMenu.title,
                    icon: allMenu.icon,
                    is_route: (allMenu.front_route) ? true : false,
                    route: (allMenu.front_route) ? allMenu.front_route : '',
                    sub_menu: []
                });
            }
        }

        for (const allMenu of allMenus) {
            if (allMenu.parent_id !== null) {
                const parent = menuTree.find(
                    item => item.id === allMenu.parent_id
                );

                if (parent) {
                    parent.sub_menu.push({
                        id: allMenu.id,
                        title: allMenu.title,
                        route: (allMenu.front_route) ? allMenu.front_route : '',
                    });
                }
            }
        }

        const filteredMenuTree = menuTree.filter(
            menu =>
                menu.sub_menu.length > 0 ||
                menu.is_route === true
        );

        res.json({
            success: true,
            message: 'Login successful',
            token: token,
            menu: filteredMenuTree,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Login failed"
        });
    }
};

// ===============================
// LOGOUT
// ===============================
export const logout = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Token required'
            });
        }

        const token = authHeader.split(' ')[1];

        const decoded = jwt.decode(token);

        if (!decoded || !decoded.id || !decoded.exp) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // ==========================================
        // CHANGE LOGIN STATUS: 1 -> 0
        // ==========================================
        await pool.execute(
            `UPDATE users
             SET is_login = 0
             WHERE id = ?`,
            [decoded.id]
        );

        // ==========================================
        // SEND SOCKET EVENT
        // ==========================================
        const io = req.app.get('io');

        io.emit('user_status_changed', {
            userId: decoded.id,
            is_login: 0
        });

        await pool.execute(
            `INSERT INTO revoked_tokens (token, expires_at)
             VALUES (?, FROM_UNIXTIME(?))`,
            [token, decoded.exp]
        );

        res.status(200).json({
            success: true,
            message: 'Logout successful'
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};