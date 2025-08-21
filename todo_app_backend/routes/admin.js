import express from 'express';
import pool from'../db.js';
import authenticateToken from '../middleware/authMiddleware.js';
import isAdmin from "../middleware/adminMiddleware.js";

const router = express.Router();

//Obtener todos los usuarios
router.get("/users", authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query("SELECT id, username, email, role, created_at FROM users ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

//Cambiar rol de un usuario
router.put("/users/:id/role", authenticateToken, isAdmin, async (req, res) => {
    const { role } = req.body;
    try {
        const result = await pool.query(
            "UPDATE users SET role=$1 WHERE id=$2 RETURNING id, username, email, role",
            [role, req.params.id]
        );

        if (result.rows.length === 0) {
            result.res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Rol actualizado correctamente", user: result.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//Eliminar usuario
router.delete("/users/:id", authenticateToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query("DELETE FROM users WHERE id=$1 RETURNING id", [req.params.id])

        if (result.rows.length === 0){
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ message: "Usuario eliminado correctamente" })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
});

export default router;