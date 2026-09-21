import pool from "../config/db.js";
import bcrypt from "bcryptjs";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

function validatePassword(password) {
    return passwordRegex.test(password);
}

// ===============================
// User list
// ===============================
export const userLists = async (req, res) => {
    try {
        let { page = 1, limit = 10, search } = req.query || {};

        page = parseInt(page);
        limit = parseInt(limit);

        if (page < 1) {
            page = 1;
        }

        if (limit < 1) {
            limit = 10;
        }

        const offset = (page - 1) * limit;

        let totalQuery = `SELECT COUNT(id) AS total FROM users`; 
        let query = `SELECT users.id, users.role_id, users.name, users.email, roles.name as role, users.is_login, users.created_at FROM users
        LEFT JOIN roles on roles.id = users.role_id`;
        let params = [];
        if (search) {
            totalQuery += ` WHERE name LIKE ? OR email LIKE ?`;
            query += ` WHERE users.name LIKE ? OR users.email LIKE ?`;
            params = [`%${search}%`, `%${search}%`];
        }
        query += ` ORDER BY users.id DESC LIMIT ? OFFSET ?`;

        const [countResult] = await pool.query(totalQuery, params);

        const total = countResult[0].total;

        const [rows] = await pool.execute(query, [...params, limit, offset]);

        const [menu] = await pool.execute(
            `select id from menus where route = ?`,
            [req.baseUrl + req.path]
        );

        let [subRoutes] = [];
        if (menu.length > 0) {
            const [getUser] = await pool.execute(
                `select role_id from users where id = ?`,
                [req.user.id]
            );
            if (getUser[0].role_id != null) {
                subRoutes = await pool.execute(
                    `SELECT menus.title, menus.route, permissions.name FROM menus
                    JOIN menu_permissions ON menu_permissions.menu_id = menus.id
                    JOIN permissions ON permissions.id = menu_permissions.permission_id
                    JOIN role_permissions ON role_permissions.permission_id = permissions.id
                    JOIN roles ON roles.id = role_permissions.role_id
                    WHERE roles.id = ? AND menus.parent_id = ?`,
                    [getUser[0].role_id, menu[0].id]
                );
            }   
        }
        
        res.json({
            success: true,
            message: 'User fetched successful',
            data: rows,
            route_permission: (subRoutes !== undefined) ? subRoutes[0] : [],
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "User listing failed"
        });
    }
}

export const createUser = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { name, email, password, role_id } = req.body || {};

        if (!name) {
            connection.release();
            return res.status(422).json({
                success: false,
                message: 'Name field is required'
            });
        }

        if (!email) {
            connection.release();
            return res.status(422).json({
                success: false,
                message: 'Email field is required'
            });
        }

        if (!password) {
            connection.release();
            return res.status(422).json({
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
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        if (!validatePassword(password)) {
            connection.release();
            return res.status(422).json({
                success: false,
                message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role_id) {
            const [existingRole] = await pool.execute(
                `select id from roles where id = ?`,
                [role_id]
            );

            if (existingRole.length == 0) {
                connection.release();
                return res.status(422).json({
                    success: false,
                    message: 'Role not exist'
                });
            }
        }

        // Never allow normal registration to create admin accounts
        const userRole = 'user';

        // Role Id is given assign role id else null assign
        const roleId = (role_id || null);

        const [result] = await connection.execute(
            `insert into users (role_id, name, email, password, role)
            values (?, ?, ?, ?, ?)`,
            [roleId, name, email, hashedPassword, userRole]
        );

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'User added successfully',
            user: {
                id: result.insertId,
                name: name,
                email: email
            }
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "User create failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}

export const viewUser = async (req, res) => {
    try {
        const { id } = req.params || {};

        const [rows] = await pool.execute(
            `SELECT users.id, users.role_id, users.name, users.email, roles.name as role, users.is_login, users.created_at FROM users
            LEFT JOIN roles on roles.id = users.role_id WHERE users.id = ?`,
            [id]
        );

        res.status(200).json({
            success: true,
            message: 'User fetch successfully',
            data: rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "User detail fetch failed"
        });
    }
}

export const updateUser = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params || {};
        const { name, email, password, role_id } = req.body || {};

        const [checkUser] = await pool.execute(
            `select role_id, password from users where id = ?`,
            [id]
        );

        if (checkUser.length == 0) {
            connection.release();

            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (!name) {
            connection.release();
            return res.status(422).json({
                success: false,
                message: 'Name field is required'
            });
        }

        if (!email) {
            connection.release();
            return res.status(422).json({
                success: false,
                message: 'Email field is required'
            });
        }

        let hashedPassword = checkUser[0].password;

        if (password) {
            if (!validatePassword(password)) {
                connection.release();
                return res.status(422).json({
                    success: false,
                    message: 'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.'
                });
            }

            // Hash password
            hashedPassword = await bcrypt.hash(password, 10);
        }

        // Check existing user
        const [existingUser] = await pool.execute(
            'SELECT id FROM users WHERE email = ? and id != ?',
            [email, id]
        );

        if (existingUser.length > 0) {
            connection.release();
            return res.status(409).json({
                success: false,
                message: 'Email already registered'
            });
        }

        let roleId = checkUser[0].role_id;

        if (role_id) {
            const [existingRole] = await pool.execute(
                `select id from roles where id = ?`,
                [role_id]
            );

            if (existingRole.length == 0) {
                connection.release();
                return res.status(422).json({
                    success: false,
                    message: 'Role not exist'
                });
            }

            roleId = role_id;
        }

        const [result] = await connection.query(
            `update users set role_id = ?, name = ?, email = ?, password = ? where id = ?`,
            [roleId, name, email, hashedPassword, id]
        );
        
        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'User updated successfully'
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "User update failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}

export const deleteUser = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params || {};

        const [checkUser] = await pool.execute(
            `select id from users where id = ?`,
            [id]
        );

        if (checkUser.length == 0) {
            connection.release();

            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const [result] = await connection.query(
            `DELETE FROM users WHERE id = ?`,
            [id]
        );
        
        await connection.commit();

        res.status(200).json({
            success: true,
            message: 'User delete successfully'
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "User delete failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}