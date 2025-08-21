import jwt from "jsonwebtoken"

// Middleware para verificar token
export default function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token requerido" });

    jwt.verify(token, process.env.JWT_SECRET || "secret", (err, user) => {
        if (err) return res.status(403).json({ error: "Token inválido" });
        req.user = user ; // contiene { id, role }
        next();
    });
}

