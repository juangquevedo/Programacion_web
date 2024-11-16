import { validationResult } from 'express-validator';
import { PatientService } from '../services/patient.mjs';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const patient = await PatientService.getPatientByEmail(email);

    if (!patient) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const isValidPassword = await bcrypt.compare(password, patient.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: patient.id, email: patient.email },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await PatientService.getPatientAppointments(req.user.id, date);
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createNewAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { doctorId, date, time } = req.body;
    const appointment = await PatientService.createAppointment(req.user.id, doctorId, date, time);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateExistingAppointment = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { appointmentId } = req.params;
    const { doctorId, date, time } = req.body;
    const appointment = await PatientService.updateAppointment(appointmentId, req.user.id, doctorId, date, time);
    res.json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteExistingAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const result = await PatientService.deleteAppointment(appointmentId, req.user.id);
    if (result) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: 'Cita no encontrada' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};