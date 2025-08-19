// src/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000", // Ajusta si usas otro puerto
});

// Interceptor: agrega el token a cada request si existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default api;
