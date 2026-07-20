package com.marioorlando.gymaccess.service;

import com.marioorlando.gymaccess.dto.CreateUserRequest;
import com.marioorlando.gymaccess.dto.RenewRequest;
import com.marioorlando.gymaccess.exception.ResourceNotFoundException;
import com.marioorlando.gymaccess.model.Payment;
import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.PaymentRepository;
import com.marioorlando.gymaccess.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;

    /**
     * SINGLE RESPONSIBILITY (SOLID): 
     * Se encarga EXCLUSIVAMENTE de inicializar a un socio nuevo con su primer mes pago por defecto.
     * @Transactional garantiza que si algo falla, no se guarde el usuario por la mitad en la BD.
     */
    @Transactional
    public User createUser(CreateUserRequest request) {
        log.info("Dando de alta a nuevo socio con DNI: {}", request.getDni());
        
        // Regla de Negocio: El socio inicia con 30 días automáticamente
        LocalDateTime expiryDate = LocalDateTime.now().plusMonths(1);

        // Entity Mapping
        User newUser = new User();
        // Dejamos que Hibernate autogenere el UUID con @GeneratedValue para evitar el error de DetachedEntity/OptimisticLocking
        // Compatibilidad con tu tabla V1 y V3 (Ambos usan versiones de nombre)
        newUser.setName(request.getFullName()); 
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail());
        newUser.setDni(request.getDni());
        // El rol predeterminado es MEMBER
        newUser.setRole("ROLE_MEMBER");
        newUser.setMembershipExpiryDate(expiryDate);
        newUser.setBirthDate(request.getBirthDate());
        newUser.setPhone(request.getPhone());
        
        // Nótese que dejamos el password en NULL deliberadamente, 
        // ya que el usuario accederá con su pulgar/DNI al tótem, no por Web.

        return userRepository.save(newUser);
    }

    /**
     * RENOVACIÓN DE MEMBRESÍA:
     * El core financiero. Suma 30 días y genera la auditoría de pago.
     */
    @Transactional
    public Payment renewMembership(UUID userId, RenewRequest request) {
        log.info("Renovando membresía para el socio {} por monto {}", userId, request.getAmount());

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Socio no encontrado"));

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentExpiry = user.getMembershipExpiryDate();

        // Lógica Fina: Si está vencido desde hace 5 meses, no le sumamos 1 mes al pasado.
        // Hacemos que su mes comience DESDE HOY.
        // Si no está vencido (viene a pagar por adelantado), se suma al tiempo sobrante.
        if (currentExpiry == null || currentExpiry.isBefore(now)) {
            user.setMembershipExpiryDate(now.plusMonths(1));
        } else {
            user.setMembershipExpiryDate(currentExpiry.plusMonths(1));
        }

        userRepository.save(user);

        // Registro inmutable del pago (Principio OCP: Abierto a extensión, cerrado a modificación)
        Payment payment = new Payment();
        payment.setUser(user);
        payment.setAmount(request.getAmount());

        return paymentRepository.save(payment);
    }
}
