import { 
    PieChart, 
    Pie, 
    Cell, 
    Tooltip, 
    Legend,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid
} from "recharts";

function Dashboard({ tasks }) {
    if (!tasks || tasks.length === 0) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md w-full max-w-3xl mt-6">
                <h3 className="text-lg font-semibold mb-2">Estadísticas</h3>
                <p>No hay tareas todavía.</p>
            </div>
        );
    }

    // === Grasfico circular: completadas vs pendiente ===
    const completed = tasks.filter((t) => t.completed).length;
    const pending = tasks.length - completed;

    const pieData = [
        { name: "Completadas", value: completed },
        { name: "Pendientes", value: pending }
    ]

    const COLORS = ["#22c55e", "#ef4444"]; // verde, rojo

    // === Grafico de barras: tareas por fecha limite ===
    const groupedByDate = tasks.reduce((acc, task) => {
        const date = task.due_date ? task.due_date.slice(0, 10) : "Sin fecha";
        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});

    const barData = Object.entries(groupedByDate).map(([date, count]) => ({
        date,
        count
    }));

    return (
        <div className="bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md w-full max-w-3xl mt-6">
            <h3 className="text-lg font-semibold mb-6 text-center">Estadísticas</h3>

            {/* Seccion de gráficos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Gráfico circular */}
                <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Estado de las tareas</h4>
                    <PieChart width={300} height={250}>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            detaKey="value"
                        >
                            {pieData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        <Legend />
                    </PieChart>
                </div>

                {/* Gráfico de barras */}
                <div className="flex flex-col items-center">
                    <h4 className="font-medium mb-2">Tareas por fecha límite</h4>
                    <BarChart
                        width={350}
                        height={250}
                        data={barData}
                        margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date"/>
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="count" fill="#3b82f6" />
                    </BarChart>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
