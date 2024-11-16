import pool from '../migrations/index.js';

export const getDoctorData = async (doctorId) => {
    try {
        const query = `
            SELECT 
                d.id,
                d.name,
                d.email,
                d.age,
                s.name as specialty,
                s.id as specialty_id
            FROM doctors d
            JOIN specialties s ON d.specialty_id = s.id
            WHERE d.id = $1
        `;
        
        const result = await pool.query(query, [doctorId]);
        return result.rows[0];
    } catch (error) {
        throw new Error('Error al obtener datos del médico: ' + error.message);
    }
};

export const getDoctorAppointmentsList = async (doctorId, date = null, status = null) => {
    try {
        let query = `
            SELECT 
                a.id,
                a.date,
                a.time,
                p.name as patient_name,
                p.email as patient_email,
                p.id as patient_id
            FROM appointments a
            JOIN patients p ON a.patient_id = p.id
            WHERE a.doctor_id = $1
        `;
        
        const values = [doctorId];
        let paramCount = 1;

        // Agregar filtro por fecha si se proporciona
        if (date) {
            paramCount++;
            query += ` AND a.date = $${paramCount}`;
            values.push(date);
        }

        // Ordenar por fecha y hora
        query += ` ORDER BY a.date, a.time`;

        const result = await pool.query(query, values);
        return result.rows;
    } catch (error) {
        throw new Error('Error al obtener citas del médico: ' + error.message);
    }
};