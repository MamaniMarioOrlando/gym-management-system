package com.marioorlando.gymaccess.service.notification;

/**
 * CONTRATO SOLID: Interface para el envío de mensajes.
 * 
 * Principio de Inversión de Dependencias (DIP):
 * Nuestros servicios de negocio (como el Scheduler) NO deben depender de implementaciones
 * concretas (ej. JavaMailSender, Twilio). Dependerán de esta abstracción.
 * Si mañana queremos notificar por WhatsApp en vez de Email, el código del negocio permanecerá intacto
 * y simplemente suministraremos otra implementación de esta interfaz.
 */
public interface MessageSender {
    void send(String to, String subject, String body);
}
