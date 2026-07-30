package com.marioorlando.gymaccess.service.notification;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

/**
 * IMPLEMENTACIÓN DIRECTA
 * Utiliza JavaMailSender para enviar la cadena (body) que ha sido generada por el Scheduler.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class EmailMessageSender implements MessageSender {

    private final JavaMailSender mailSender;

    @Override
    public void send(String to, String subject, String body) {
        try {
            // Se usa MimeMessage para permitir enviar cuerpos codificados en HTML puro
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // true = El body contiene HTML (rendereado por Thymeleaf)

            mailSender.send(message);
            log.info("Correo enviado de manera exitosa a: {}", to);
        } catch (MessagingException e) {
            log.error("Error catastrófico al enviar correo a: {}. Detalle: {}", to, e.getMessage());
            // No detenemos el hilo arrojando una excepción hacia arriba, solo capturamos el fallo.
        }
    }
}
