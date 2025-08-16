import React, { useState, useEffect } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";
import { Toaster } from "react-hot-toast";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [view, setView] = useState("tasks");
  const [user, setUser] = useState(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleTaskSaved = () => {
    setRefreshKey((prev) => prev + 1);
    setTaskToEdit(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // En un proyecto más grande validaríamos el token en backend
      setUser({})
    }
  }, []);

  if (!user) {
    return showRegister ? (
      <Register
        onRegister={(u) => setUser(u)}
      />
    ) : (
      <Login
        onLogin={(u) => setUser(u)}
      />
    );
  }

  return (
    <div className="container mx-auto px-4">
      <Toaster position="top-right" />

      {/* Navbar */}
      <div className="flex flex-col sm:flex-row gap-2 my-4">
        <button
          onClick={() => setView("tasks")}
          className={`px-4 py-2 rounded w-full sm:w-auto ${view === "tasks" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Tareas
        </button>
        <button
          onClick={() => setView("dashboard")}
          className={`px-4 py-2 rounded w-full sm:w-auto ${view === "dashboard" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
        >
          Dashboard
        </button>
        <button
          onClick={() => {
            localStorage.removeItem("token");
            setUser(null);
          }}
          className="px-4 py-2 rounded bg-red-500 text-white"
        >
          Cerrar Sesión
        </button>
      </div>

      {view === "tasks" ? (
        <>
          <TaskForm
            onTaskSaved={handleTaskSaved}
            taskToEdit={taskToEdit}
            onCancelEdit={() => setTaskToEdit(null)}
          />
          <TaskList
            key={refreshKey}
            onEditTask={(task) => setTaskToEdit(task)}
          />
        </>
      ) : (
        <Dashboard refreshKey={refreshKey} />
      )}
      {view === "dashboard" && <Dashboard/>}
    </div>
  );
}

export default App;
