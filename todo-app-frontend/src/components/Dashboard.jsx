import React, { useEffect, useState } from "react";
import axios from "axios";
import { PieChart, Pie, Cell, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";

const Dashboard = ({ refreshKey }) => {
    const [tasks, setTasks] = useState([]);

    const fetchTasks = async () => {
        try {
            const res = await axios.get("http://localhost:5000/tasks");
            setTasks(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [refreshKey]); // 👈 se recarga cuando cambie refreshKey

    const total = tasks.length;
    const completed = tasks.filter((t) => t.completed).length;
    const pending = total - completed;

    const dataPie = [
        { name: "Completadas", value: completed },
        { name: "Pendientes", value: pending },
    ];

    const COLORS = ["#4ade80", "#facc15"]; // Verde y Amarillo

    const dataBar = [
        { name: "Tareas", Completadas: completed, Pendientes: pending }
    ];

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">📊 Dashboard de Tareas</h1>

            {/* Resumen */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 shadow rounded text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Total</h2>
                    <p className="text-2xl font-bold">{total}</p>
                </div>
                <div className="bg-white p-4 shadow rounded text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Completadas</h2>
                    <p className="text-2xl font-bold text-green-600">{completed}</p>
                </div>
                <div className="bg-white p-4 shadow rounded text-center">
                    <h2 className="text-lg font-semibold text-gray-600">Pendientes</h2>
                    <p className="text-2xl font-bold text-yellow-600">{pending}</p>
                </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* PieChart */}
                <div className="bg-white p-4 shadow rounded w-full">
                    <h2 className="text-lg font-semibold mb-4">Distribución</h2>
                    <PieChart width={250} height={250} className="mx-auto md:mx-0">
                        <Pie
                            data={dataPie}
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                            label
                        >
                            {dataPie.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                {/* BarChart */}
                <div className="bg-white p-4 shadow rounded w-full">
                    <h2 className="text-lg font-semibold mb-4">Comparación</h2>
                    <BarChart width={400} height={300} data={dataBar}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis allowDecimals={false} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Completadas" fill="#4ade80" />
                        <Bar dataKey="Pendientes" fill="#facc15" />
                    </BarChart>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;
