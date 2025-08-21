import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import api from "./api";
import TaskForm from "./components/TaskForm";
import Dashboard from "./components/Dashboard";
import Navbar from "./components/Navbar";
import AdminDashboard from "./AdminDashboard";

function App() {
  const [showRegister, setShowRegister] = useState(false);
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  // ✅ cargar preferencia de tema al iniciar
  useEffect(() => {
    const savedTheme = localStorage.getItem("darkMode");
    if (savedTheme === "true") setDarkMode(true);
  }, []);

  // ✅ guardar preferencia cada vez que cambia
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    // aplica/quita la clase globalmente
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [darkMode]);

  const handleLogin = (userData) => setUser(userData);
  const handleRegister = (userData) => setUser(userData);
  const toggleForm = () => setShowRegister(!showRegister);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Error al cargar tareas:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setTasks([]);
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await api.put(`/tasks/complete/${taskId}`);
      setTasks(tasks.map((t) => (t.id === taskId ? { ...t, completed: true } : t)));
    } catch (err) {
      console.error("Error al completar tarea:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Error al eliminar tarea", err);
    }
  };

  // === Filtro aplicado ===
  const filteredTasks = tasks.filter((task) => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    if (filterDate) return task.due_date?.slice(0, 10) === filterDate;
    return true; // "all"
  });

  // === Vista con usuario logeado ===
  if (user) {
    return (
      <div className={ "min-h-screen" }>
        <Navbar
          user={user}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
        />

        <div className="flex flex-col items-center justify-start min-h-screen bg-gray-50 dark:bg-gray-900 dark:text-white pt-6">
          <h2 className="text-xl mb-2">Tus tareas</h2>

          <TaskForm onTaskCreated={(newTask) => setTasks([...tasks, newTask])} />

          {/* === Controles de filtro === */}
          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setFilter("all");
                  setFilterDate("");
                }}
                className={`px-3 py-1 rounded ${filter === "all" && !filterDate ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                  }`}
              >
                Todas
              </button>
              <button
                onClick={() => {
                  setFilter("pending");
                  setFilterDate("");
                }}
                className={`px-3 py-1 rounded ${filter === "pending" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                  }`}
              >
                Pendientes
              </button>
              <button
                onClick={() => {
                  setFilter("completed");
                  setFilterDate("");
                }}
                className={`px-3 py-1 rounded ${filter === "completed" ? "bg-blue-500 text-white" : "bg-gray-200 dark:bg-gray-700"
                  }`}
              >
                Completadas
              </button>
            </div>

            {/* Filtro por fecha */}
            <div>
              <input
                type="date"
                value={filterDate}
                onChange={(e) => {
                  setFilterDate(e.target.value);
                  setFilter("all");
                }}
                className="border p-2 rounded dark:bg-gray-700 dark:text-white"
              />
              {filterDate && (
                <button
                  onClick={() => setFilterDate("")}
                  className="ml-2 text-sm text-red-500 hover:underline"
                >
                  Limpiar fecha
                </button>
              )}
            </div>
          </div>

          {/* === Lista de tareas filtradas === */}
          <ul className="mb-4 w-80">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="p-2 border rounded mb-2 flex justify-between items-center bg-white dark:bg-gray-800 dark:border-gray-700"
              >
                <span>
                  {task.title}{" "}
                  {task.completed ? "✅" : <span className="text-red-500">⏳</span>}
                </span>

                <div className="flex gap-2">
                  {!task.completed && (
                    <button
                      onClick={() => handleCompleteTask(task.id)}
                      className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 text-sm"
                    >
                      Completar
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <Dashboard tasks={tasks} />
        </div>
      </div>
    );
  }

  // === Vista Login/Register ===
  return (
    <div className={"min-h-screen"}>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white">
        {showRegister ? (
          <Register onRegister={handleRegister} />
        ) : (
          <Login onLogin={handleLogin} />
        )}
        <button
          onClick={toggleForm}
          className="mt-4 text-blue-500 hover:underline"
        >
          {showRegister
            ? "¿Ya tienes cuenta? Inicia sesión"
            : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}

export default App;
