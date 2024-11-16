import express from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth.mjs';
import {
  login,
  getAppointments,
  createNewAppointment,
  updateExistingAppointment,
  deleteExistingAppointment
} from '../controllers/patient.mjs';

const router = express.Router();

// Validaciones
const appointmentValidations = [
  body('doctorId').isInt().withMessage('Doctor ID debe ser un número entero'),
  body('date').isDate().withMessage('Formato de fecha inválido'),
  body('time').matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).withMessage('Formato de hora inválido')
];

// Rutas
router.post('/login', [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').notEmpty().withMessage('La contraseña es requerida')
], login);

router.get('/appointment', authenticateToken, getAppointments);
router.post('/appointment', authenticateToken, appointmentValidations, createNewAppointment);
router.put('/appointment/:appointmentId', authenticateToken, appointmentValidations, updateExistingAppointment);
router.delete('/appointment/:appointmentId', authenticateToken, deleteExistingAppointment);

export default router;