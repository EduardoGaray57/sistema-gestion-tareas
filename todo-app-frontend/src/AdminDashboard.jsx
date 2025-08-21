import { useEffect, useState } from "react";

function AdminDashboard() {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    // Recuperar el token del localStorage
    const token = localStorage.getItem("token");

    // Obtener lista de usuario
    const fetchUsers = async () => {
        try {
            const res = await fetch("http://localhost:5000/admin/users", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Error al cargar usuario");
            }

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError(err.message);
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
        try {
            const res = await fetch(`http://localhost:5000/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Error al eliminar usuario");

            fetchUsers();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded shadow-md">
            <h1 className="text-2xl font-bold mb-4 dark:text-white">Panel de Administración</h1>
            {error && <p className="text-red-500">{error}</p>}

            <table className="w-full border-collapse border border-gray-300 dark:border-gray-700">
                <thead>
                    <tr className="bg-gray-200 dark:bg-gray-700">
                        <th className="border p-2">ID</th>
                        <th className="border p-2">Usuario</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Rol</th>
                        <th className="border p-2">Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-100 dark:hover:bg-gray-600">
                            <td className="border p-2">{user.id}</td>
                            <td className="border p-2">{user.username}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2">{user.role}</td>
                            <td className="border p-2 flex gap-2">
                                <button
                                    onClick={() => changeRole(user.id, user.role === "admin" ? "user" : "admin")}
                                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                >
                                    {user.role === "admin" ? "Hacer User" : "Hacer Admin"}
                                </button>
                                <button
                                    onClick={() => deleteUser(user.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                >
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminDashboard;