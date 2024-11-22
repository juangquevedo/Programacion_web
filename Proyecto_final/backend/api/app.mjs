// Importaciones necesarias
import express from 'express';
import dotenv from 'dotenv';
import routes from './routes.mjs'; // Importamos las rutas
import pool from './database.mjs'; // Asegúrate de tener este módulo para la conexión a la base de datos

// Configuración de las variables de entorno
dotenv.config();

// Configuración del servidor
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para manejar JSON
app.use(express.json());

// Verificación de conexión a la base de datos
(async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Conexión a la base de datos establecida.');
        connection.release(); // Liberar la conexión después de verificarla
    } catch (error) {
        console.error('Error al conectar a la base de datos:', error);
        process.exit(1); // Finalizar si no se puede conectar
    }
})();

// Configuración de rutas
app.use('/', routes);

// Middleware para manejar rutas no encontradas
app.use((req, res) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Algo salió mal, por favor intenta más tarde.' });
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});