import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // El token viene como "Bearer <token>"

    if (!token) return res.status(401).json({ error: 'Acceso no autorizado' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token inválido' });

        req.user = user; // Guardamos el usuario en la solicitud
        next();
    });
};

export default authenticateToken;
