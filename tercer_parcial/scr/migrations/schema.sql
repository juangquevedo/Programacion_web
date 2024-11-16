-- Create Database
CREATE DATABASE clinic;

\c clinic;

-- Create Specialties Table
CREATE TABLE specialties (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL
);

-- Create Doctors Table
CREATE TABLE doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    specialty_id INTEGER NOT NULL,
    FOREIGN KEY (specialty_id) REFERENCES specialties(id)
);

-- Create Patients Table
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL
);

-- Create Appointments Table
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,
    date DATE NOT NULL,
    time TIME NOT NULL,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id),
    FOREIGN KEY (patient_id) REFERENCES patients(id)
);

-- Create indexes for better performance
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, date);
CREATE INDEX idx_appointments_patient_date ON appointments(patient_id, date);
CREATE INDEX idx_doctors_specialty ON doctors(specialty_id);