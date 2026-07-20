package com.marioorlando.gymaccess.repository;

import com.marioorlando.gymaccess.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;
import java.util.List;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    // Patrón de diseño: Consultas declarativas
    List<Payment> findByUserId(UUID userId);
}
