function Navbar({ user, darkMode, setDarkMode, handleLogout }) {
    return (
        <nav className="w-full flex justify-between items-center px-6 py-3 bg-white dark:bg-gray-800 shadow-md">
            {/* Logo o título */}
            <h1 className="text-xl font-bold dark:text-white">
                📋 Gestor de Tareas
            </h1>

            {/* Usuario + acciones */}
            <div className="flex items-center gap-4">
                <span className="text-gray-700 dark:text-gray-200">
                    Hola, {user.username} 👋
                </span>

                {/* Switch dark mode */}
                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                    {darkMode ? "☀️ Claro" : "🌙 Oscuro"}
                </button>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    className="ox-3 py-1 rounded bg-red-500 text-white hover:bg-red-600"
                >
                    Cerrer sesión
                </button>

            </div>
        </nav>
    );
}

export default Navbar