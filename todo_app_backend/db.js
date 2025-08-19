import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "todo_db",
    password: process.env.DB_PASSWORD || "Ed02041998",
    port: process.env.PORT || 5432,
});

export default pool;