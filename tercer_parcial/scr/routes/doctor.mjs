import express from 'express';
import { authenticateToken } from '../middleware/auth.mjs';
import { 
    getDoctorById, 
    getDoctorAppointments 
} from '../controllers/doctor.mjs';

const router = express.Router();

// Ruta para obtener información de un doctor específico
router.get('/:doctorId', authenticateToken, getDoctorById);

// Ruta para obtener las citas de un doctor específico
router.get('/:doctorId/appointment', authenticateToken, getDoctorAppointments);

export default router;