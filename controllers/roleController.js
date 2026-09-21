import pool from "../config/db.js";

export const roleLists = async (req, res) => {
    try {
        const { search } = req.query || {};

        let query = `SELECT * FROM roles`;
        let params = [];
        if (search) {
            query += ` WHERE name LIKE ?`;
            params = [`%${search}%`];
        }

        const [roles] = await pool.execute(query);

        res.json({
            success: true,
            message: 'Role fetched successful',
            data: roles
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: "Role listing failed"
        });
    }
}

export const createRole = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();
        
        const { name } = req.body || {};

        if (!name) {
            connection.release();

            return res.status(422).json({
                success: false,
                message: 'Name field is required'
            });
        }

        // Check existing role
        const [existingRole] = await connection.execute(
            'SELECT id FROM roles WHERE name = ?',
            [name]
        );

        if (existingRole.length > 0) {
            connection.release();

            return res.status(409).json({
                success: false,
                message: 'Role already exist'
            });
        }

        const [result] = await connection.execute(
            `INSERT INTO roles(name)
            VALUES (?)`,
            [name]
        )

        await connection.commit();

        res.status(201).json({
            success: true,
            message: 'Role added successfully',
            user: {
                id: result.insertId,
                name: name
            }
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Role create failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}

export const updateRole = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params || {};
        const { name } = req.body || {};

        if (!id) {
            connection.release();

            res.status(400).json({
                success: false,
                message: "Bad request"
            });
        }

        if (!name) {
            connection.release();

            return res.status(422).json({
                success: false,
                message: 'Name field is required'
            });
        }

        // Check existing role
        const [existingRole] = await connection.execute(
            'SELECT id FROM roles WHERE id = ?',
            [id]
        );

        if (existingRole.length == 0) {
            connection.release();

            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        // Check existing role
        const [existingRoleName] = await connection.execute(
            'SELECT id FROM roles WHERE name = ? AND id != ?',
            [name, id]
        );

        if (existingRoleName.length > 0) {
            connection.release();

            return res.status(409).json({
                success: false,
                message: 'Role already exist'
            });
        }

        const [result] = await connection.query(
            'UPDATE roles SET name = ? WHERE id = ?',
            [name, id]
        );

        await connection.commit();

        res.json({
            success: true,
            message: 'Role updated successfully'
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Role update failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}

export const deleteRole = async (req, res) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const { id } = req.params || {};
        
        if (!id) {
            connection.release();

            res.status(400).json({
                success: false,
                message: "Bad request"
            });
        }

        // Check existing role
        const [existingRole] = await connection.execute(
            'SELECT id FROM roles WHERE id = ?',
            [id]
        );

        if (existingRole.length == 0) {
            connection.release();

            return res.status(404).json({
                success: false,
                message: 'Role not found'
            });
        }

        const [result] = await connection.query(
            `DELETE FROM roles WHERE id = ?`,
            [id]
        );
        
        await connection.commit();

        res.json({
            success: true,
            message: 'Role delete successfully'
        });
    } catch (error) {
        await connection.rollback();

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Role delete failed"
        });
    } finally {
        // Always release the connection
        connection.release();
    }
}