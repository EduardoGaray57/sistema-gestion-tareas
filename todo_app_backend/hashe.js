import bcrypt from "bcrypt";

const nuevaPassword = "Admin1234";   // 👉 aquí pones tu nueva contraseña
const hashed = await bcrypt.hash(nuevaPassword, 10);
console.log(hashed);
