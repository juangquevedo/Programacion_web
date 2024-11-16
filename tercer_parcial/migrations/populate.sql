insert into speciality (name) values
	("medicina general"),
	("cardiología"),
	("urología"),
	("fisiología"),
	("pediatría");

INSERT INTO doctor (`name`, `age`, `email`, `pasword`, `speciality_id`) VALUES
('Juan Pérez', 45, 'juan.perez@hospital.com', 'securepass1', 1),
('Ana García', 39, 'ana.garcia@cardio.com', 'cardiopass', 2),
('Luis Martínez', 50, 'luis.martinez@urolo.com', 'urolopass', 3),
('María López', 34, 'maria.lopez@fisio.com', 'fisiopass', 4),
('Pedro Sánchez', 29, 'pedro.sanchez@pediatria.com', 'pediapass', 5); 

INSERT INTO patient (`name`, `age`, `email`, `password`) VALUES
('Carlos Ruiz', 30, 'carlos.ruiz@correo.com', 'passcarlos'),
('Lucía Fernández', 25, 'lucia.fernandez@correo.com', 'passlucia'),
('Mario Gómez', 45, 'mario.gomez@correo.com', 'passmario'),
('Sara Pérez', 35, 'sara.perez@correo.com', 'passsara'),
('Javier Ortiz', 40, 'javier.ortiz@correo.com', 'passjavier'),
('Elena Rodríguez', 29, 'elena.rodriguez@correo.com', 'passelena'),
('Miguel Torres', 50, 'miguel.torres@correo.com', 'passmiguel'),
('Andrea Castro', 22, 'andrea.castro@correo.com', 'passandrea'),
('Fernando López', 38, 'fernando.lopez@correo.com', 'passfernando'),
('Paula Martínez', 27, 'paula.martinez@correo.com', 'passpaula');
