import { useState } from 'react'

function RegisterForm({ onRegister }) {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password:""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await fetch ("http://localhost:5000/auth/register", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Error al registrar usuario");
            } else {
                setSuccess("Usuario registrado con éxito 🎉");
                onRegister?.(data);
            }
        } catch (err) {
            setError("Error de conexion con el servidor");
        }
    };

    return (
        <div className='max-w-md mx-auto bg-white shadow-md rounded-xl p-6 mt-10'>
            <h2 className='text-2xl font-bold text-center mb-4'>Registro</h2>
            {error && <p className='text-red-500 mb-2'>{error}</p>}
            {success && <p className='text-green-500 mb-2'>{success}</p>}
            <form onSubmit={handleSubmit} className='space-y-4'>
                <input 
                    type="text"
                    name='username'
                    placeholder='Nombre de usuario'
                    value={formData.username}
                    onChange={handleChange}
                    className='w-full p-2 border rounded-lg'
                    required 
                />
                <input 
                    type="email"
                    name='email'
                    placeholder='Correo electrónico'
                    value={formData.email}
                    onChange={handleChange}
                    className='w-full p-2 border rounded-lg'
                    required
                />
                <input 
                    type="password"
                    name='password'
                    placeholder='Contraseña'
                    value={formData.password}
                    onChange={handleChange}
                    className='w-full p-2 border rounded-lg'
                    required
                />
                <button
                    type='submit'
                    className='w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700'
                >
                    Registrarse
                </button>
            </form>
        </div>
    );
}

export default RegisterForm