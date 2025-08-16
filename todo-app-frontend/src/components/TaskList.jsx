import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const TaskList = ({ onEditTask }) => {
    const [tasks, setTasks] = useState([]);
    const [filter, setFilter] = useState("all")
    const [sortOrder, setSortOrder] = useState("asc")

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error(err);
            toast.error("Error al cargar las tareas")
        }
    };

    const completeTask = async (id) => {
        try {
            await axios.put(`http://localhost:5000/tasks/complete/${id}`);
            fetchTasks();
            toast.success("Tarea completada 🎉");
        } catch (err) {
            console.error(err);
            toast.error("No se pudo completar la tarea")
        }
    };

    const deleteTask = async (id) => {
        if (!window.confirm("¿Seguro que quieres eliminar esta tarea?")) return;

        try {
            await axios.delete(`http://localhost:5000/tasks/${id}`);
            fetchTasks();
            toast.success("Tarea eliminada ✅")
        } catch (err) {
            console.error(err);
            toast.error("No se pudo eliminar la tarea");
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    // Filtrar tareas segun se seleccione
    const filteredTasks = tasks.filter((task) => {
        if (filter === "pending") return !task.completed;
        if (filter === "completed") return task.completed;
        return true; //all
    });

    // Ordenar tareas por fecha límite
    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (!a.due_date || !b.due_date) return 0;
        return sortOrder === "asc"
            ? new Date(a.due_date) - new Date(b.due_date)
            : new Date(b.due_date) - new Date(a.due_date);
    });

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Lista de Tareas</h1>

            {/* Controles de filtro y orden */}
            <div className="flex flex-wrap items-center gap-4 mb-4">
                <div>
                    <label className="mr-2 font-medium text-gray-700">Mostrar:</label>
                    <select 
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="all">Todas</option>
                        <option value="pending">Pendientes</option>
                        <option value="completed">Completadas</option>
                    </select>
                </div>

                <div>
                    <label className="mr-2 font-medium text-gray-700">Ordenar por fecha:</label>
                    <select 
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1"
                    >
                        <option value="asc">Más próximas primero</option>
                        <option value="desc">Más lejanas primero</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white shadow-lg rounded-lg overflow-x-auto">
                <table className="min-w-full border border-gray-200 text-sm md:text-base">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="py-3 px-4 md:px-4 border-b">ID</th>
                            <th className="py-3 px-4 md:px-4 border-b">Título</th>
                            <th className="py-3 px-4 md:px-4 border-b">Descripción</th>
                            <th className="py-3 px-4 md:px-4 border-b">Fecha límite</th>
                            <th className="py-3 px-4 md:px-4 border-b">Estado</th>
                            <th className="py-3 px-4 md:px-4 border-b">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedTasks.length > 0 ? (
                            sortedTasks.map((task) => (
                                <tr key={task.id} className="hover:bg-gray-50">
                                    <td className="border px-4 py-2">{task.id}</td>
                                    <td className="border px-4 py-2">{task.title}</td>
                                    <td className="border px-4 py-2">{task.description}</td>
                                    <td className="border px-4 py-2">{task.due_date}</td>
                                    <td className="border px-4 py-2">
                                        {task.completed ? (
                                            <span className="text-green-600 font-semibold">Completada</span>
                                        ) : (
                                            <span className="text-yellow-600 font-semibold">Pendiente</span>
                                        )}
                                    </td>
                                    <td className="border px-4 py-2 flex gap-2">
                                        {!task.completed && (
                                            <button
                                                onClick={() => completeTask(task.id)}
                                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm"
                                            >
                                                Completar
                                            </button>
                                        )}
                                        <button
                                            onClick={() => deleteTask(task.id)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center py-4 text-gray-500 italic">
                                    No hay tareas registradas
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TaskList;
