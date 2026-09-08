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
export const authorizeRoles = (...allowedRoles) => {

    return (req, res, next) => {

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorized'
            });
        }

        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.'
            });
        }

        next();
    };
};