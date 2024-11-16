import pool from '../migrations/index.js';

class DoctorService {
    // Obtener doctor por ID
    async getDoctorData(doctorId) {
        try {
            const query = `
                SELECT 
                    d.id,
                    d.name,
                    d.email,
                    d.age,
                    s.name as specialty,
                    s.id as specialty_id,
                    (
                        SELECT COUNT(*)
                        FROM appointments a
                        WHERE a.doctor_id = d.id
                        AND a.date >= CURRENT_DATE
                    ) as upcoming_appointments
                FROM doctors d
                JOIN specialties s ON d.specialty_id = s.id
                WHERE d.id = $1
            `;
            
            const result = await pool.query(query, [doctorId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error al obtener datos del médico: ' + error.message);
        }
    }

    // Obtener todas las citas del doctor
    async getDoctorAppointmentsList(doctorId, filters = {}) {
        try {
            const { date, status, patientName } = filters;
            let query = `
                SELECT 
                    a.id,
                    a.date,
                    a.time,
                    p.name as patient_name,
                    p.email as patient_email,
                    p.age as patient_age,
                    p.id as patient_id
                FROM appointments a
                JOIN patients p ON a.patient_id = p.id
                WHERE a.doctor_id = $1
            `;
            
            const values = [doctorId];
            let paramCount = 1;

            // Filtro por fecha
            if (date) {
                paramCount++;
                query += ` AND a.date = $${paramCount}`;
                values.push(date);
            }

            // Filtro por nombre de paciente
            if (patientName) {
                paramCount++;
                query += ` AND p.name ILIKE $${paramCount}`;
                values.push(`%${patientName}%`);
            }

            // Ordenar por fecha y hora
            query += ` ORDER BY a.date, a.time`;

            const result = await pool.query(query, values);
            return result.rows;
        } catch (error) {
            throw new Error('Error al obtener citas del médico: ' + error.message);
        }
    }

    // Verificar disponibilidad del doctor
    async checkDoctorAvailability(doctorId, date, time) {
        try {
            const query = `
                SELECT EXISTS (
                    SELECT 1 
                    FROM appointments 
                    WHERE doctor_id = $1 
                    AND date = $2 
                    AND time = $3
                ) as is_busy
            `;
            
            const result = await pool.query(query, [doctorId, date, time]);
            return !result.rows[0].is_busy;
        } catch (error) {
            throw new Error('Error al verificar disponibilidad del médico: ' + error.message);
        }
    }

    // Obtener horarios disponibles
    async getAvailableTimeSlots(doctorId, date) {
        try {
            // Asumimos horario de trabajo de 8:00 a 17:00 con citas de 1 hora
            const workingHours = Array.from({length: 10}, (_, i) => `${i + 8}:00`);
            
            const query = `
                SELECT time 
                FROM appointments 
                WHERE doctor_id = $1 
                AND date = $2
            `;
            
            const result = await pool.query(query, [doctorId, date]);
            const bookedTimes = result.rows.map(row => row.time);
            
            return workingHours.filter(time => !bookedTimes.includes(time));
        } catch (error) {
            throw new Error('Error al obtener horarios disponibles: ' + error.message);
        }
    }

    // Obtener estadísticas del doctor
    async getDoctorStats(doctorId) {
        try {
            const query = `
                SELECT 
                    COUNT(*) as total_appointments,
                    COUNT(CASE WHEN date >= CURRENT_DATE THEN 1 END) as upcoming_appointments,
                    COUNT(CASE WHEN date < CURRENT_DATE THEN 1 END) as past_appointments,
                    COUNT(DISTINCT patient_id) as total_patients
                FROM appointments
                WHERE doctor_id = $1
            `;
            
            const result = await pool.query(query, [doctorId]);
            return result.rows[0];
        } catch (error) {
            throw new Error('Error al obtener estadísticas del médico: ' + error.message);
        }
    }
}

export { DoctorService };