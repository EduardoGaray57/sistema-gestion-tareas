import express from "express";
import pool from "../db.js";

const router = express.Router();

// Crear tarea
router.post("/", async (req, res) => {
    try {
        const { title, description, due_date, user_id } = req.body;
        const result = await pool.query(
            "INSERT INTO tasks (title, description, due_date, completed, user_id) VALUES ($1, $2, $3, false, $4) RETURNING *",
            [title, description, due_date, user_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar tareas
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM tasks ORDER BY id ASC");
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Completar tarea
router.put("/complete/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("UPDATE tasks SET completed = TRUE WHERE id=$1", [id]);
        res.json({ message: "Tarea completada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Eliminar tarea
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM tasks WHERE id=$1", [id]);
        res.json({ message: "Tarea eliminada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
