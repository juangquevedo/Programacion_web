import pool from '../migrations/index.js';
import bcrypt from 'bcrypt';

class PatientService {
    // Obtener paciente por email
    async getPatientByEmail(email) {
        const query = 'SELECT id, email, password FROM patients WHERE email = $1';
        const result = await pool.query(query, [email]);
        return result.rows[0];
    }

    // Crear nuevo paciente
    async createPatient(patientData) {
        const { name, email, password, age } = patientData;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Verificar si el email ya existe
            const existingPatient = await this.getPatientByEmail(email);
            if (existingPatient) {
                throw new Error('El email ya está registrado');
            }

            // Hashear la contraseña
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insertar nuevo paciente
            const query = `
                INSERT INTO patients (name, email, password, age) 
                VALUES ($1, $2, $3, $4) 
                RETURNING id, name, email, age
            `;
            const values = [name, email, hashedPassword, age];
            const result = await client.query(query, values);

            await client.query('COMMIT');
            return result.rows[0];
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Obtener citas del paciente
    async getPatientAppointments(patientId, filters = {}) {
        const { date, doctorId, upcoming } = filters;
        let query = `
            SELECT 
                a.id,
                a.date,
                a.time,
                d.name as doctor_name,
                d.email as doctor_email,
                s.name as specialty,
                d.id as doctor_id
            FROM appointments a
            JOIN doctors d ON a.doctor_id = d.id
            JOIN specialties s ON d.specialty_id = s.id
            WHERE a.patient_id = $1
        `;
        
        const values = [patientId];
        let paramCount = 1;

        if (date) {
            paramCount++;
            query += ` AND a.date = $${paramCount}`;
            values.push(date);
        }

        if (doctorId) {
            paramCount++;
            query += ` AND a.doctor_id = $${paramCount}`;
            values.push(doctorId);
        }

        if (upcoming) {
            query += ` AND a.date >= CURRENT_DATE`;
        }

        query += ` ORDER BY a.date, a.time`;

        const result = await pool.query(query, values);
        return result.rows;
    }

    // Crear nueva cita
    async createAppointment(appointmentData) {
        const { patientId, doctorId, date, time } = appointmentData;
        const client = await pool.connect();

        try {
            await client.query('BEGIN');

            // Verificar disponibilidad del médico
            const doctorAvailability = await client.query(
                'SELECT id FROM appointments WHERE doctor_id = $1 AND date = $2 AND time = $3',
                [doctorId, date, time]
            );

            if (doctorAvailability.rows.length > 0) {
                throw new Error('El médico no está disponible en esa fecha y hora');
            }

            // Verificar disponibilidad del paciente
            const patientAvailability = await client.query(
                'SELECT id FROM appointments WHERE patient_id = $1 AND date = $2 AND time = $3',
                [patientId, date, time]
            );

            if (patientAvailability.rows.length > 0) {
                throw new Error('Ya tienes una cita programada para esa fecha y hora');
            }

            // Crear la cita
            const result = await client.query(
                `INSERT INTO appointments (patient_id, doctor_id, date, time) 
                 VALUES ($1, $2, $3, $4) 
                 RETURNING *`,
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
    }

    // Actualizar cita existente
    async updateAppointment(appointmentId, appointmentData) {
        // Similar implementation to createAppointment
        // Incluye verificaciones de disponibilidad
    }

    // Eliminar cita
    async deleteAppointment(appointmentId, patientId) {
        const result = await pool.query(
            'DELETE FROM appointments WHERE id = $1 AND patient_id = $2 RETURNING id',
            [appointmentId, patientId]
        );
        return result.rows.length > 0;
    }
}

export { PatientService };