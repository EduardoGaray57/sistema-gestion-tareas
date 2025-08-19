import { useState } from "react";
import api from "../api";

function TaskForm({ onTaskCreated }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/tasks", {
                title,
                description,
                due_date: dueDate,
            });
            onTaskCreated(res.data); // avisamos al padre que hay una nueva tarea
            setTitle("");
            setDescription("");
            setDueDate("");
        } catch (err) {
            setError("Error al crear la tarea");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md w-80 mb-4"
        >
            <h3 className="text-lg font-semibold mb-3 dark:text-white">Nueva tarea</h3>

            {error && <p className="text-red-500 mb-2">{error}</p>}

            <input
                type="text"
                placeholder="Título"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border w-full p-2 mb-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
            />

            <textarea
                placeholder="Descripción"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border w-full p-2 mb-2 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />

            <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="border w-full p-2 mb-3 rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                required
            />

            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
                Crear
            </button>
        </form>
    );
}

export default TaskForm;
