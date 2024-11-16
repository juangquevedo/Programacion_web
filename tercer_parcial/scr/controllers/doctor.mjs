import { DoctorService } from '../services/doctor.mjs';

export const getDoctorById = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const doctor = await DoctorService.getDoctorData(doctorId);
        
        if (!doctor) {
            return res.status(404).json({ message: 'Médico no encontrado' });
        }

        res.json(doctor);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoctorAppointments = async (req, res) => {
    try {
        const { doctorId } = req.params;
        const { date, status } = req.query; // Permitimos filtrar por fecha y estado
        
        const appointments = await DoctorService.getDoctorAppointmentsList(doctorId, date, status);
        res.json(appointments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};