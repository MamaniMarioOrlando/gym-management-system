package com.marioorlando.gymaccess.service;

import com.marioorlando.gymaccess.dto.AccessResponse;
import com.marioorlando.gymaccess.dto.ScanRequest;
import com.marioorlando.gymaccess.exception.CustomAccessDeniedException;
import com.marioorlando.gymaccess.exception.ResourceNotFoundException;
import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.service.biometric.BiometricReader;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class AccessService {

    private final BiometricReader biometricReader;
    private final AccessLogService logService;

    public AccessService(BiometricReader biometricReader, AccessLogService logService) {
        this.biometricReader = biometricReader;
        this.logService = logService;
    }

    @Transactional
    public AccessResponse processAccess(ScanRequest request) {
        String identifier = request.getIdentifier();

        // 1. Buscar Usuario (Usando Strategy Pattern: PREPARACIÓN HARDWARE)
        User user = biometricReader.findByIdentifier(identifier)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado en la base de datos"));

        // 2. Evaluar Membresía
        LocalDateTime now = LocalDateTime.now();
        boolean isActive = false;
        
        if (user.getMembershipExpiryDate() != null) {
            isActive = now.isBefore(user.getMembershipExpiryDate());
        }

        // 3. Flujo de Decisión Compartido (Logging)
        if (!isActive) {
            logService.saveLog(user, identifier, false, "Membresía expirada o inactiva");
            throw new CustomAccessDeniedException("Comuníquese con Recepción");
        }

        // 4. Conceder Acceso
        logService.saveLog(user, identifier, true, null);

        return AccessResponse.builder()
                .granted(true)
                .fullName(user.getFullName())
                .expiryDate(user.getMembershipExpiryDate())
                .message("Bienvenido " + user.getFullName())
                .build();
    }
}
