import bcrypt from 'bcrypt'; // Para manejar contraseñas
import jwt from 'jsonwebtoken'; // Para generar tokens JWT
import db from '../db/index.js'; // Tu conexión a la base de datos

const secretKey = process.env.JWT_SECRET; // Llave secreta para JWT desde las variables de entorno

class PatientService {
    static async login(email, password) {
    const query = 'SELECT id, email, password FROM patients WHERE email = $1';
    const values = [email];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('Usuario no encontrado');
    }

    const patient = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, patient.password);
    if (!passwordMatch) {
      throw new Error('Contraseña incorrecta');
    }

    // Generar token JWT
    const token = jwt.sign({ id: patient.id }, secretKey, { expiresIn: '30m' });

    return { token, patient: { id: patient.id, email: patient.email } };
  }

  static async listAppointments(patientId, date = null) {
    let query = `
      SELECT id, doctor_id, date, time 
      FROM appointments 
      WHERE patient_id = $1
    `;
    const values = [patientId];

    if (date) {
      query += ' AND date = $2';
      values.push(date);
    }

    const result = await db.query(query, values);
    return result.rows;
  }

  static async createAppointment(patientId, doctorId, date, time) {
    // Verifica disponibilidad del médico
    const doctorQuery = `
      SELECT id FROM appointments 
      WHERE doctor_id = $1 AND date = $2 AND time = $3
    `;
    const doctorValues = [doctorId, date, time];
    const doctorResult = await db.query(doctorQuery, doctorValues);

    if (doctorResult.rows.length > 0) {
      throw new Error('El médico no está disponible en esa fecha y hora');
    }

    // Verifica disponibilidad del paciente
    const patientQuery = `
      SELECT id FROM appointments 
      WHERE patient_id = $1 AND date = $2 AND time = $3
    `;
    const patientValues = [patientId, date, time];
    const patientResult = await db.query(patientQuery, patientValues);

    if (patientResult.rows.length > 0) {
      throw new Error('El paciente ya tiene una cita en esa fecha y hora');
    }

    // Crea la cita
    const insertQuery = `
      INSERT INTO appointments (patient_id, doctor_id, date, time) 
      VALUES ($1, $2, $3, $4) 
      RETURNING *
    `;
    const insertValues = [patientId, doctorId, date, time];
    const result = await db.query(insertQuery, insertValues);

    return result.rows[0];
  }

  static async updateAppointment(appointmentId, doctorId, date, time) {
    // Valida la disponibilidad como en `createAppointment`

    const query = `
      UPDATE appointments 
      SET doctor_id = $1, date = $2, time = $3 
      WHERE id = $4 
      RETURNING *
    `;
    const values = [doctorId, date, time, appointmentId];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      throw new Error('La cita no existe');
    }

    return result.rows[0];
  }

  static async deleteAppointment(appointmentId) {
    const query = 'DELETE FROM appointments WHERE id = $1';
    const values = [appointmentId];
    const result = await db.query(query, values);

    return result.rowCount > 0;
  }
}

export default PatientService;
