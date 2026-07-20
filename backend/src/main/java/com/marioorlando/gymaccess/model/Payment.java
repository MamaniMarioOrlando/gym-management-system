package com.marioorlando.gymaccess.model;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación Fuerte: Un pago no existe si no hay un usuario
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // BigDecimal es estricto y previene errores de redondeo en monedas (Buena práctica financiera)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    // Timestamp automático manejado por Hibernate
    @CreationTimestamp
    @Column(name = "payment_date", updatable = false)
    private LocalDateTime paymentDate;
}
