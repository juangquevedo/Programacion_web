import jwt from 'jsonwebtoken';
import { validationResult } from 'express-validator';
import { getPatientByEmail, getPatientAppointments, createAppointment} from '../services/patient.js';

export const login = async (req, res) => {
  const { email, password } = req.body;
  const patient = await getPatientByEmail(email);

  if (!patient || patient.password !== password) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign({ id: patient.id }, process.env.JWT_SECRET, { expiresIn: '30m' });
  res.json({ token });
};
