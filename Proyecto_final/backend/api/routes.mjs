import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import pool from './database.mjs';

const router = Router();

// Obtener todos los eventos
router.get('/eventos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Eventos');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// Obtener todos los usuarios (solo para pruebas, se eliminara)
router.get('/usuarios', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM Usuarios');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }

  try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(contrasena, 10);

      const [result] = await pool.query(
          'INSERT INTO Usuarios (nombre, email, contrasena) VALUES (?, ?, ?)',
          [nombre, email, hashedPassword]
      );

      res.status(201).json({ id: result.insertId, nombre, email });
  } catch (error) {
      res.status(500).json({ error: 'Error al crear el usuario' });
  }
});

router.post('/login', async (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
  }

  try {
      // Buscar al usuario por email
      const [users] = await pool.query('SELECT * FROM Usuarios WHERE email = ?', [email]);

      if (users.length === 0) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      const usuario = users[0];

      // Verificar la contraseña
      const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);
      if (!isMatch) {
          return res.status(401).json({ error: 'Credenciales incorrectas' });
      }

      // Generar un token JWT
      const token = jwt.sign(
          { id: usuario.usuario_id, email: usuario.email },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      return res.json({ message: 'Login exitoso', token });
  } catch (error) {
      console.error('Error en el login:', error);
      return res.status(500).json({ error: 'Error del servidor' });
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