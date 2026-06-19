CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    biometric_id VARCHAR(255) UNIQUE,
    role VARCHAR(50) NOT NULL
);

CREATE TABLE memberships (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL
);

CREATE TABLE access_logs (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    access_time TIMESTAMP NOT NULL,
    granted BOOLEAN NOT NULL,
    reason VARCHAR(255)
);

-- Seed Data Falsa (Para pruebas de desarrollo de Fase 2, como no aprobaste ni negaste la pregunta abierta, asumo que será útil)
INSERT INTO users (id, name, email, biometric_id, role) 
VALUES 
('11111111-1111-1111-1111-111111111111', 'Mario Orlando (Desarrollador)', 'mario@admin.com', 'HUELLA_MARIO_DEV', 'ROLE_ADMIN'),
('22222222-2222-2222-2222-222222222222', 'Cliente Activo', 'cliente@example.com', 'HUELLA_ACTIVA_1', 'ROLE_MEMBER'),
('33333333-3333-3333-3333-333333333333', 'Cliente Vencido', 'vencido@example.com', 'HUELLA_VENCIDA_2', 'ROLE_MEMBER');

INSERT INTO memberships (id, user_id, start_date, end_date, status)
VALUES
(gen_random_uuid(), '22222222-2222-2222-2222-222222222222', CURRENT_DATE - INTERVAL '1 month', CURRENT_DATE + INTERVAL '1 month', 'ACTIVE'),
(gen_random_uuid(), '33333333-3333-3333-3333-333333333333', CURRENT_DATE - INTERVAL '3 months', CURRENT_DATE - INTERVAL '1 day', 'EXPIRED');
