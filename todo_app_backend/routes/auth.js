import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db.js";

const router = express.Router();

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

        // 👇 aquí asignamos role = "user" por defecto
        const newUser = await pool.query(
            "INSERT INTO users (username, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, username, email, role, created_at",
            [username, email, hashedPassword, "user"]
        );

        const token = jwt.sign(
            { id: newUser.rows[0].id, role: newUser.rows[0].role }, // token incluye role
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        res.json({ token, user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Login ---
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

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
            { id: user.id, role: user.role }, // 👈 incluimos role
            process.env.JWT_SECRET || "secret",
            { expiresIn: "7d" }
        );

        delete user.password; // nunca devolver el password
        res.json({ token, user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- Actualizar contraseña ---
router.put("/update-password", async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

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
