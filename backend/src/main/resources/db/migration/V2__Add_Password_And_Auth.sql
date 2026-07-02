-- Agregamos la columna de password a la tabla users
ALTER TABLE users ADD COLUMN password VARCHAR(255);

-- Actualizamos el usuario administrador semilla para que tenga credenciales de ingreso
-- Usamos el prefijo {noop} para indicarle al DelegatingPasswordEncoder de Spring Security 
-- que, temporalmente por ser data semilla, no use un encriptador complejo. 
-- En producción, cualquier nuevo usuario usará {bcrypt}...
UPDATE users 
SET password = '{noop}Admin123!' 
WHERE email = 'mario@admin.com';
