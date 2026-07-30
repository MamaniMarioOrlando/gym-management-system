package com.marioorlando.gymaccess.service.notification;

import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationSchedulerService {

    private final UserRepository userRepository;

    // DIP: Dependemos de la interfaz MessageSender, no del EmailMessageSender
    // concreto.
    private final MessageSender messageSender;

    // Motor de plantillas sin necesidad de contexto Web (Server-Side String
    // Processing)
    private final TemplateEngine templateEngine;

    @Value("${gym.frontend-url}")
    private String frontendUrl;

    /**
     * El Despertador (Cron Job).
     * Se ejecuta todos los días a las 8:00 AM: "0 0 8 * * ?"
     * Usamos @Async para que Spring envíe este trabajo a un ThreadPool y evitemos
     * bloquear el hilo primario
     * de programaciones (Scheduling).
     */
    @Async
    @Scheduled(cron = "0 0 8 * * ?") // Descomentar para pruebas rápidas: @Scheduled(cron = "0 * * * * *")
    public void processExpirationWarnings() {
        log.info("Iniciando auditoría diaria de vencimientos (CRON-JOB)...");

        // Definimos la ventana crítica: desde AYER (vencidos recientes) hasta 3 DÍAS EN
        // EL FUTURO (preventivo)
        LocalDateTime windowStart = LocalDateTime.now().minusDays(2).withHour(0).withMinute(0);
        LocalDateTime windowEnd = LocalDateTime.now().plusDays(3).withHour(23).withMinute(59);

        // Llamada a la BD
        List<User> usersAtRisk = userRepository.findByMembershipExpiryDateBetween(windowStart, windowEnd);
        log.info("Encontrados {} socios en riesgo o recién vencidos.", usersAtRisk.size());

        for (User user : usersAtRisk) {

            // Protección contra SPAM: Evaluamos la columna last_reminder_sent_at
            if (user.getLastReminderSentAt() != null) {
                long daysSinceLastReminder = ChronoUnit.DAYS.between(user.getLastReminderSentAt(), LocalDateTime.now());
                if (daysSinceLastReminder < 3) {
                    log.debug("Saltando a {}. Se le avisó hace menos de 3 días.", user.getEmail());
                    continue; // Skip al siguiente socio
                }
            }

            // Inyectar variables en el Thymeleaf Context
            Context context = new Context();
            context.setVariable("userFullName", user.getFullName());

            String formattedDate = user.getMembershipExpiryDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));
            context.setVariable("expiryDate", formattedDate);
            context.setVariable("renewLink", frontendUrl);

            // Determinar tipo de aviso para el Asunto
            boolean isAlreadyExpired = user.getMembershipExpiryDate().isBefore(LocalDateTime.now());
            String subject = isAlreadyExpired ? "¡Tu Membresía ha Vencido! 🛑"
                    : "Aviso Preventivo: Tu membresía está por vencer ⚠️";
            context.setVariable("isExpired", isAlreadyExpired);

            try {
                // Renderizamos la plantilla
                // (backend/src/main/resources/templates/email-reminder.html)
                String htmlBody = templateEngine.process("email-reminder", context);

                // Envíamos con la abstracción
                messageSender.send(user.getEmail(), subject, htmlBody);

                // Actualizamos estado en DB (Idempotencia - Anti Spam Fase 10)
                user.setLastReminderSentAt(LocalDateTime.now());
                userRepository.save(user);

            } catch (Exception e) {
                // Try-Catch dentro del Bucle:
                // Si el correo para Mario falla, no podemos dejar que esto rompa y evite enviar
                // el correo para Pedro.
                log.error("Fallo general al procesar plantilla o guardar DB del usuario {}", user.getEmail(), e);
            }
        }
    }
}
