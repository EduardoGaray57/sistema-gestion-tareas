import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function Login({ onLogin }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post("/auth/login", { email, password });

            // el backend devuelve { token, user }
            const { token, user } = res.data;

            // actualiza estado global en App.jsx - CORREGIDO: pasar como objeto
            onLogin({ user, token });

            // redirigir según el rol
            if (user.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || "Error en el login");
        }
    };

    return (
        <div className="p-4 w-80 bg-white dark:bg-gray-800 shadow rounded">
            <h2 className="text-xl mb-4 text-center">Iniciar Sesión</h2>
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 rounded dark:bg-gray-700 dark:text-white"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Entrar
                </button>
            </form>
        </div>
    );
}

export default Login;