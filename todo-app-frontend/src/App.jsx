import React, { useState } from "react";
import TaskForm from "./components/TaskForm";
import TaskList from "./components/TaskList";
import Dashboard from "./components/Dashboard";
import { Toaster } from "react-hot-toast";

function App() {
  const [refreshKey, setRefreshKey] = useState(0);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [view, setView] = useState("tasks");

  const handleTaskSaved = () => {
    setRefreshKey((prev) => prev + 1);
    setTaskToEdit(null);
  };

  return (
    <div className="container mx-auto">
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
    </div>
  );
}

export default App;
