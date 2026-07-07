-- Evolución de users a Módulo de Membresías
ALTER TABLE users ADD COLUMN dni VARCHAR(20) UNIQUE;
ALTER TABLE users ADD COLUMN full_name VARCHAR(150);
ALTER TABLE users ADD COLUMN birth_date DATE;
ALTER TABLE users ADD COLUMN membership_expiry_date TIMESTAMP;
ALTER TABLE users ADD COLUMN fingerprint_hash VARCHAR(255);
ALTER TABLE users ADD COLUMN phone VARCHAR(20);

-- Para no romper la base de datos si hay multiples usuarios sin DNI, y no violar la restricción UNIQUE
-- El prefijo y el ID garantizan la unicidad sin límites de dígitos.
UPDATE users 
SET dni = 'TEMP_' || id, 
    full_name = COALESCE(full_name, 'Sistema Admin'), 
    membership_expiry_date = COALESCE(membership_expiry_date, NOW() + INTERVAL '10 years') 
WHERE dni IS NULL;

-- Ahora aseguramos las restricciones
ALTER TABLE users ALTER COLUMN dni SET NOT NULL;
ALTER TABLE users ALTER COLUMN full_name SET NOT NULL;


-- Nueva Tabla: Bitácora de Accesos (Reemplaza a la tabla simple de la V1)
DROP TABLE IF EXISTS access_logs;

CREATE TABLE access_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    scanned_identifier VARCHAR(50) NOT NULL,
    access_granted BOOLEAN NOT NULL,
    rejection_reason VARCHAR(255),
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    method VARCHAR(20) DEFAULT 'KIOSK',
    CONSTRAINT fk_access_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Índices de Alta Velocidad (Porque habrá millones de escaneos)
CREATE INDEX idx_users_dni ON users(dni);
CREATE INDEX idx_logs_user_id ON access_logs(user_id);
CREATE INDEX idx_logs_scanned_at ON access_logs(scanned_at);
