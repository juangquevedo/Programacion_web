import express from 'express';
import dotenv from 'dotenv';
import patientRoutes from './routes/patient.mjs';
import doctorRoutes from './routes/doctor.mjs';

dotenv.config();

const app = express();
app.use(express.json());

app.use('/patient', patientRoutes);
app.use('/doctor', doctorRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
