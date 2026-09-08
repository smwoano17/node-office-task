import pool from "../config/db.js";

// ===============================
// User list
// ===============================
export const userLists = async (req, res) => {
    try {
        const { search } = req.body || {};

        let query = `SELECT id, name, email, role, is_login, created_at FROM users`;
        let params = [];
        if (search) {
            query += ` WHERE name LIKE ? OR email LIKE ?`;
            params = [`%${search}%`, `%${search}%`];
        }

        const [rows] = await pool.execute(query, params);

        res.json({
            success: true,
            message: 'User fetched successful',
            data: rows
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "User listing failed"
        });
    }
}