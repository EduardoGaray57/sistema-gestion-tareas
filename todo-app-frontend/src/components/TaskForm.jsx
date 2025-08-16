import React, { useState, useEffect } from "react";
import axios from "axios";

const TaskForm = ({ onTaskSaved, taskToEdit, onCancelEdit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [dueDate, setDueDate] = useState("");

    // Rellenar datos si estamos editando
    useEffect(() => {
        if (taskToEdit) {
            setTitle(taskToEdit.title || "");
            setDescription(taskToEdit.description || "");
            setDueDate(taskToEdit.due_date || "");
        } else {
            setTitle("");
            setDescription("");
            setDueDate("");
        }
    }, [taskToEdit]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title.trim() || !dueDate) {
            alert("Por favor, completa al menos el título y la fecha límite.");
            return;
        }

        try {
            if (taskToEdit) {
                // EDITAR
                await axios.put(`http://localhost:5000/tasks/${taskToEdit.id}`, {
                    title,
                    description,
                    due_date: dueDate,
                });
            } else {
                // CREAR
                await axios.post("http://localhost:5000/tasks", {
                    title,
                    description,
                    due_date: dueDate,
                });
            }

            // Limpiar formulario
            setTitle("");
            setDescription("");
            setDueDate("");

            // Avisar al padre que se guardó
            if (onTaskSaved) onTaskSaved();

            // Si estaba editando, cancelar el modo edición
            if (onCancelEdit) onCancelEdit();

        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
                {taskToEdit ? "Editar Tarea" : "Agregar Nueva Tarea"}
            </h2>
            <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-4 md:p-6 flex flex-col md:flex-row gap-4">

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Escribe el título de la tarea"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                        placeholder="Escribe una descripción (opcional)"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha límite</label>
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="flex-1 border rounded px-3 py-2"
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium px-4 py-2 rounded-md"
                    >
                        {taskToEdit ? "Guardar Cambios" : "Guardar Tarea"}
                    </button>
                    {taskToEdit && (
                        <button
                            type="button"
                            onClick={onCancelEdit}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-medium px-4 py-2 rounded-md"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
};

export default TaskForm;
