import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

// ===============================
// VERIFY JWT
// ===============================
export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Expected:
    // Authorization: Bearer TOKEN

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Access token required'
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        // 1. Verify JWT
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // 2. Check revoked_tokens table
        const [revokedTokens] = await pool.execute(
            `SELECT id
             FROM revoked_tokens
             WHERE token = ?
             LIMIT 1`,
            [token]
        );

        // 3. Token has been revoked
        if (revokedTokens.length > 0) {
            return res.status(401).json({
                success: false,
                message: 'Token has been revoked'
            });
        }

        // 4. Token is valid
        req.user = decoded;

        next();
    } catch (error) {

        return res.status(403).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

// ===============================
// ROLE CHECK
// ===============================
// export const authorizeRoles = () => {

//     return (req, res, next) => {

//         // if (!req.user) {
//         //     return res.status(401).json({
//         //         success: false,
//         //         message: 'Unauthorized'
//         //     });
//         // }

//         // console.log(req);

//         // if (!allowedRoles.includes(req.user.role)) {
//         //     return res.status(403).json({
//         //         success: false,
//         //         message: 'Access denied. Insufficient permissions.'
//         //     });
//         // }

//         next();
//     };
// };

export const authorizeRoles = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        
        const [existRoute] = await pool.execute(
            `select id from menus where route = ?`,
            [req.baseUrl + req.path]
        );

        if (existRoute.length > 0) {
            const [getUser] = await pool.execute(
                `select role_id from users where id = ?`,
                [req.user.id]
            );
            
            if (getUser[0].role_id == null) {
                return res.status(403).json({
                    success: false,
                     message: 'Access denied. Insufficient permissions.'
                });
            }

            const [menuPermission] = await pool.execute(
                `SELECT menus.id FROM menus
                JOIN menu_permissions ON menu_permissions.menu_id = menus.id
                JOIN permissions ON permissions.id = menu_permissions.permission_id
                JOIN role_permissions ON role_permissions.permission_id = permissions.id
                JOIN roles ON roles.id = role_permissions.role_id
                WHERE roles.id = ? AND menus.route = ?`,
                [getUser[0].role_id, req.baseUrl + req.path]
            );

            if (menuPermission.length == 0) {
                return res.status(403).json({
                    success: false,
                     message: 'Access denied. Insufficient permissions.'
                });
            }
        }

        next();
    } catch (error) {

        console.error('AUTHENTICATE ERROR:', error);

        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
}