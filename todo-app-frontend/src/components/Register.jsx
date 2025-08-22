import { useState } from "react";
import api from "../api";

function Register({ onRegister }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/auth/register", {
                username,
                email,
                password,
            });

            // CORREGIDO: pasar el objeto completo con user y token
            if (res.data?.user && res.data?.token) {
                onRegister(res.data); // Pasar todo res.data que contiene { user, token }
            } else {
                setError("Error en el servidor, datos incompletos.");
            }
        } catch (err) {
            console.error("Error en registro:", err);
            setError(err.response?.data?.error || "Error al registrarse");
        }
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-gray-800 p-6 rounded shadow-md w-80"
        >
            <h2 className="text-lg mb-4">Registro</h2>

            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

            <input
                type="text"
                placeholder="Nombre de usuario"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
            />

            <input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
            />

            <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full mb-3 p-2 border rounded dark:bg-gray-700 dark:text-white"
            />

            <button
                type="submit"
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
                Registrarse
            </button>
        </form>
    );
}

export default Register;