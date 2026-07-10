-- Ajustamos los datos semilla para las pruebas del Kiosco
UPDATE users 
SET membership_expiry_date = NOW() - INTERVAL '1 month', 
    full_name = 'Cliente Vencido'
WHERE email = 'vencido@example.com';

UPDATE users 
SET full_name = 'Cliente Activo'
WHERE email = 'cliente@example.com';

UPDATE users
SET full_name = 'Mario Orlando (CEO)'
WHERE email = 'mario@admin.com';
