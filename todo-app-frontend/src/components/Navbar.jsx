import { Link, useNavigate } from "react-router-dom";

function Navbar({ user, darkMode, setDarkMode, handleLogout }) {
    const navigate = useNavigate();

    const logout = () => {
        // 🧹 limpiar almacenamiento
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        handleLogout();
        navigate("/"); // volver al login
    };

    return (
        <nav className="flex justify-between items-center px-6 py-3 bg-gray-200 dark:bg-gray-800 dark:text-white">
            <div className="flex items-center gap-4">
                <Link to="/" className="font-bold text-lg">
                    📋 Task Manager
                </Link>

                {/* Menú visible solo si es admin */}
                {user?.role === "admin" && (
                    <Link
                        to="/admin"
                        className="px-3 py-1 rounded bg-purple-500 text-white hover:bg-purple-600"
                    >
                        Admin
                    </Link>
                )}
            </div>

            <div className="flex items-center gap-4">
                <span className="hidden md:inline">
                    👤 {user?.username || "Invitado"}
                </span>

                {/* Botón Dark Mode */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-1 rounded bg-gray-400 dark:bg-gray-600 hover:opacity-80"
                >
                    {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
                </button>

                {/* Botón logout */}
                <button
                    onClick={logout}
                    className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                    Cerrar sesión
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
