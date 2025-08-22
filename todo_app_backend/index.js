import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import adminRoutes from "./routes/admin.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);
app.use("/admin", adminRoutes);


// --- ENDPOINTS CRUD ---

//Crear tarea
app.post('/tasks', async (req, res) => {
    console.log(req.body); // <-- esto mostrará lo que llega al backend
    try {
        const { title, description, due_date } = req.body;
        const newTask = await pool.query(
            "INSERT INTO tasks (title, description, due_date) VALUES ($1, $2, $3) RETURNING *",
            [title, description, due_date]
        );
        res.json(newTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


// Listar todas las tareas
app.get('/tasks', async (req, res) => {
    try {
        const allTasks = await pool.query("SELECT * FROM tasks ORDER BY id ASC")
        res.json(allTasks.rows)
    } catch (err) {
        console.error(err.message)
    }
});

// Marcar tarea como completada
app.put('/tasks/complete/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateTask = await pool.query(
            "UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING *",
            [id]
        );
        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});



// Editar tarea
app.put('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, due_date } = req.body;

        const updateTask = await pool.query(
            "UPDATE tasks SET title = $1, description = $2, due_date = $3 WHERE id = $4 RETURNING *",
            [title, description, due_date, id]
        );

        res.json(updateTask.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: err.message });
    }
});


// Eliminar tarea
app.delete('/tasks/:id', async (req, res) => {
    try {
        const { id } = req.params
        await pool.query("DELETE FROM tasks WHERE id = $1", [id])
        res.json({ message: "Tarea eliminada" })
    } catch (err) {
        console.error(err.message);
    }
});

// --- INICIAR SERVIDOR ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
});
