import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../migrations/index.js';

export const getPatientByEmail = async (email) => {
  const query = 'SELECT id, email, password FROM patients WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

export const getPatientAppointments = async (patientId, date = null) => {
  let query = `
    SELECT a.id, a.doctor_id, a.date, a.time,
           d.name as doctor_name, s.name as specialty
    FROM appointments a
    JOIN doctors d ON a.doctor_id = d.id
    JOIN specialties s ON d.specialty_id = s.id
    WHERE a.patient_id = $1
  `;
  const values = [patientId];

  if (date) {
    query += ' AND a.date = $2';
    values.push(date);
  }

  query += ' ORDER BY a.date, a.time';
  const result = await pool.query(query, values);
  return result.rows;
};

export const createAppointment = async (patientId, doctorId, date, time) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar disponibilidad del médico
    const doctorCheck = await client.query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND date = $2 AND time = $3',
      [doctorId, date, time]
    );

    if (doctorCheck.rows.length > 0) {
      throw new Error('El médico no está disponible en esa fecha y hora');
    }

    // Verificar disponibilidad del paciente
    const patientCheck = await client.query(
      'SELECT id FROM appointments WHERE patient_id = $1 AND date = $2 AND time = $3',
      [patientId, date, time]
    );

    if (patientCheck.rows.length > 0) {
      throw new Error('Ya tienes una cita programada para esa fecha y hora');
    }

    // Crear la cita
    const result = await client.query(
      'INSERT INTO appointments (patient_id, doctor_id, date, time) VALUES ($1, $2, $3, $4) RETURNING *',
      [patientId, doctorId, date, time]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const updateAppointment = async (appointmentId, patientId, doctorId, date, time) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // Verificar que la cita existe y pertenece al paciente
    const appointmentCheck = await client.query(
      'SELECT id FROM appointments WHERE id = $1 AND patient_id = $2',
      [appointmentId, patientId]
    );

    if (appointmentCheck.rows.length === 0) {
      throw new Error('Cita no encontrada o no autorizada');
    }

    // Verificar disponibilidad del médico
    const doctorCheck = await client.query(
      'SELECT id FROM appointments WHERE doctor_id = $1 AND date = $2 AND time = $3 AND id != $4',
      [doctorId, date, time, appointmentId]
    );

    if (doctorCheck.rows.length > 0) {
      throw new Error('El médico no está disponible en esa fecha y hora');
    }

    // Verificar disponibilidad del paciente
    const patientCheck = await client.query(
      'SELECT id FROM appointments WHERE patient_id = $1 AND date = $2 AND time = $3 AND id != $4',
      [patientId, date, time, appointmentId]
    );

    if (patientCheck.rows.length > 0) {
      throw new Error('Ya tienes una cita programada para esa fecha y hora');
    }

    // Actualizar la cita
    const result = await client.query(
      'UPDATE appointments SET doctor_id = $1, date = $2, time = $3 WHERE id = $4 AND patient_id = $5 RETURNING *',
      [doctorId, date, time, appointmentId, patientId]
    );

    await client.query('COMMIT');
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

export const deleteAppointment = async (appointmentId, patientId) => {
  const result = await pool.query(
    'DELETE FROM appointments WHERE id = $1 AND patient_id = $2 RETURNING id',
    [appointmentId, patientId]
  );
  return result.rows.length > 0;
};