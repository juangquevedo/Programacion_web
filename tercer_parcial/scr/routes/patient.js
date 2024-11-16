import express from 'express';
import { login, getAppointments, createAppointment, updateAppointment, deleteAppointment } from '../controllers/patient.js';

const router = express.Router();

router.post('/login', login);
router.get('/appointment', getAppointments);
router.post('/appointment', createAppointment);
router.put('/appointment/:appointmentId', updateAppointment);
router.delete('/appointment/:appointmentId', deleteAppointment);

export default router;
