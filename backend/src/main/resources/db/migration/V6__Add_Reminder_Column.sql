-- Fase 10: Prevención de Spam en Notificaciones Automáticas
-- Esta columna asegura la Idempotencia del Cron Job.
ALTER TABLE users ADD COLUMN last_reminder_sent_at TIMESTAMP;
