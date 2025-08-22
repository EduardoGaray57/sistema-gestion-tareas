import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

/**
 * Función auxiliar para limpiar datos del usuario antes de enviarlos al frontend
 */
const formatUser = (user) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    created_at: user.created_at
});

// --- Registrar usuario ---
router.post("/register", async (req, res) => {
    try {
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        // verificar si existe
        const checkUser = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (checkUser.rows.length > 0) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // encriptar contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // por defecto asignamos role = "user"
        const newUser = await pool.query(
            `INSERT INTO users (username, email, password, role) 
             VALUES ($1, $2, $3, $4) 
             RETURNING id, username, email, role, created_at`,
            [username, email, hashedPassword, "user"]
        );

        const user = newUser.rows[0];

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({ token, user: formatUser(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Login ---
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email y contraseña requeridos" });
        }

        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rows.length === 0) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(password, user.password);

        if (!valid) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({ token, user: formatUser(user) });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Actualizar contraseña ---
router.put("/update-password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        if (!email || !oldPassword || !newPassword) {
            return res.status(400).json({ error: "Todos los campos son requeridos" });
        }

        const result = await pool.query("SELECT * FROM users WHERE email=$1", [email]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        const user = result.rows[0];
        const valid = await bcrypt.compare(oldPassword, user.password);

        if (!valid) {
            return res.status(400).json({ error: "Contraseña actual incorrecta" });
        }

        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        await pool.query("UPDATE users SET password=$1 WHERE email=$2", [hashedNewPassword, email]);

        res.json({ message: "Contraseña actualizada correctamente" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
