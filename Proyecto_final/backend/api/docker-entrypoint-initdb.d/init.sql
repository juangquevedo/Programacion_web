CREATE DATABASE IF NOT EXISTS meethub;

USE meethub;

-- Tabla Usuarios
CREATE TABLE IF NOT EXISTS Usuarios (
    usuario_id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    contrasena VARCHAR(100) NOT NULL
);

-- Tabla Eventos
CREATE TABLE IF NOT EXISTS Eventos (
    evento_id INT PRIMARY KEY AUTO_INCREMENT,
    titulo VARCHAR(100) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    hora TIME NOT NULL,
    ubicacion VARCHAR(255),
    tipo_evento ENUM('publico', 'privado') DEFAULT 'privado',
    organizador_id INT,
    FOREIGN KEY (organizador_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE
);

-- Tabla Participantes
CREATE TABLE IF NOT EXISTS Participantes (
    participante_id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT,
    evento_id INT,
    confirmado BOOLEAN DEFAULT FALSE,
    fecha_inscripcion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES Usuarios(usuario_id) ON DELETE CASCADE,
    FOREIGN KEY (evento_id) REFERENCES Eventos(evento_id) ON DELETE CASCADE,
    UNIQUE (usuario_id, evento_id)
);

-- Tabla Notificaciones
CREATE TABLE IF NOT EXISTS Notificaciones (
    notificacion_id INT PRIMARY KEY AUTO_INCREMENT,
    evento_id INT,
    mensaje VARCHAR(255) NOT NULL,
    fecha_envio TIMESTAMP,
    FOREIGN KEY (evento_id) REFERENCES Eventos(evento_id) ON DELETE CASCADE
);

INSERT INTO Usuarios (nombre, email, contrasena)
VALUES 
('Juan Pérez', 'juan@example.com', 'password123'),
('Ana García', 'ana@example.com', 'password456'),
('Carlos Ruiz', 'carlos@example.com', 'password789');

INSERT INTO Eventos (titulo, descripcion, fecha, hora, ubicacion, tipo_evento, organizador_id)
VALUES
('Fiesta de cumpleaños', 'Celebración en el jardín', '2024-12-01', '18:00:00', 'Parque Central', 'privado', 1),
('Conferencia Tech', 'Últimas tendencias en tecnología', '2024-12-10', '10:00:00', 'Auditorio Principal', 'publico', 2);

INSERT INTO Participantes (usuario_id, evento_id, confirmado)
VALUES
(1, 1, TRUE),
(2, 1, FALSE),
(3, 2, TRUE);

INSERT INTO Notificaciones (evento_id, mensaje, fecha_envio)
VALUES
(1, 'El evento está por comenzar', NOW()),
(2, 'Actualización en el evento', NOW());