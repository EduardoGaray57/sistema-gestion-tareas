import { useEffect, useState } from "react";
import { Users, UserCheck, Activity, Calendar, LogOut, BarChart3 } from "lucide-react";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [kpis, setKpis] = useState({
        totalUsers: 0,
        activeUsers: 0,
        adminUsers: 0,
        newUsersToday: 0,
        newUsersThisWeek: 0,
        newUsersThisMonth: 0
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    // Recuperar el token del localStorage
    const token = localStorage.getItem("token");

    // Función para cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem("token");

        // Aquí puedes agregar lógica adicional como:
        // - Redirigir al login
        // - Limpiar estado global
        // - Mostrar mensaje de confirmación

        alert("Sesión cerrada correctamente");
        window.location.href = "/login"; // Redirección al login
    };

    // Calcular KPIs basado en los datos
    const calculateKPIs = (userData) => {
        const today = new Date().toISOString().split('T')[0];
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        return {
            totalUsers: userData.length,
            activeUsers: userData.filter(user => {
                const daysSinceActive = Math.floor((new Date() - new Date(user.lastActive)) / (1000 * 60 * 60 * 24));
                return daysSinceActive <= 7;
            }).length,
            adminUsers: userData.filter(user => user.role === "admin").length,
            newUsersToday: userData.filter(user => user.createdAt >= today).length,
            newUsersThisWeek: userData.filter(user => user.createdAt >= weekAgo).length,
            newUsersThisMonth: userData.filter(user => user.createdAt >= monthAgo).length
        };
    };

    // Obtener lista de usuario
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al cargar usuarios");
            }

            const data = await res.json();

            setUsers(data);
            setKpis(calculateKPIs(data));
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Cambiar rol
    const changeRole = async (id, newRole) => {
        try {
            const res = await fetch(`http://localhost:5000/admin/users/${id}/role`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ role: newRole }),
            });
            if (!res.ok) throw new Error("Error al cambiar rol");

            fetchUsers(); //recargar lista
        } catch (err) {
            setError(err.message);
        }
    };

    // Eliminar usuario
    const deleteUser = async (id) => {
        if (!confirm("¿Estás seguro de que deseas eliminar este usuario?")) {
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al eliminar usuario");

            fetchUsers(); // Recargar lista
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-300 rounded mb-4"></div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-24 bg-gray-300 rounded"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md">
            {/* Header con botón de cerrar sesión */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Panel de Administración
                </h1>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    <LogOut size={18} />
                    Cerrar Sesión
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {/* KPIs Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">Total Usuarios</p>
                            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{kpis.totalUsers}</p>
                        </div>
                        <Users className="text-blue-500" size={32} />
                    </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-600 dark:text-green-400 font-medium">Usuarios Activos</p>
                            <p className="text-2xl font-bold text-green-900 dark:text-green-100">{kpis.activeUsers}</p>
                            <p className="text-xs text-green-500">Últimos 7 días</p>
                        </div>
                        <Activity className="text-green-500" size={32} />
                    </div>
                </div>

                <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-600 dark:text-purple-400 font-medium">Administradores</p>
                            <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">{kpis.adminUsers}</p>
                        </div>
                        <UserCheck className="text-purple-500" size={32} />
                    </div>
                </div>

                <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-orange-600 dark:text-orange-400 font-medium">Nuevos Hoy</p>
                            <p className="text-2xl font-bold text-orange-900 dark:text-orange-100">{kpis.newUsersToday}</p>
                        </div>
                        <Calendar className="text-orange-500" size={32} />
                    </div>
                </div>
            </div>

            {/* KPIs adicionales en fila */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <BarChart3 size={20} />
                        Crecimiento de Usuarios
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Esta semana:</span>
                            <span className="font-medium">{kpis.newUsersThisWeek} nuevos</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Este mes:</span>
                            <span className="font-medium">{kpis.newUsersThisMonth} nuevos</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Distribución de Roles</h3>
                    <div className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Usuarios regulares:</span>
                            <span className="font-medium">{kpis.totalUsers - kpis.adminUsers}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">Tasa de actividad:</span>
                            <span className="font-medium">{Math.round((kpis.activeUsers / kpis.totalUsers) * 100)}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabla de usuarios */}
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                        Gestión de Usuarios
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Última Actividad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                            {user.username}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin'
                                                ? 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100'
                                                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {user.lastActive}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                        <button
                                            onClick={() => changeRole(user.id, user.role === "admin" ? "user" : "admin")}
                                            className="inline-flex items-center px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-md transition-colors"
                                        >
                                            {user.role === "admin" ? "Hacer User" : "Hacer Admin"}
                                        </button>
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="inline-flex items-center px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-md transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;