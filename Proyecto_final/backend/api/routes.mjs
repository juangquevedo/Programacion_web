import { Router } from 'express';
const router = Router();
import pool from './database.mjs';

// Obtener todos los eventos
router.get('/eventos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Eventos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
  const { nombre, email, contrasena } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
      [nombre, email, contrasena]
    );
    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

// Crear un nuevo evento
router.post('/eventos', async (req, res) => {
  const { titulo, descripcion, fecha, hora, ubicacion, tipo_evento, organizador_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Eventos (titulo, descripcion, fecha, hora, ubicacion, tipo_evento, organizador_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [titulo, descripcion, fecha, hora, ubicacion, tipo_evento, organizador_id]
    );
    res.status(201).json({ id: result.insertId, titulo });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el evento' });
  }
});

// Participar en un evento
router.post('/participantes', async (req, res) => {
  const { usuario_id, evento_id } = req.body;
  try {
    const [result] = await pool.query(
      'INSERT INTO Participantes (usuario_id, evento_id) VALUES (?, ?)',
      [usuario_id, evento_id]
    );
    res.status(201).json({ id: result.insertId, usuario_id, evento_id });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar participante' });
  }
});

export default router;
