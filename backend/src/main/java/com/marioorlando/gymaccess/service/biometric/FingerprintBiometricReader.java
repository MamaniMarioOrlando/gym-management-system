package com.marioorlando.gymaccess.service.biometric;

import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Optional;

// PREPARACIÓN HARDWARE
@Service
@Profile("prod") // Se activa automáticamente en producción
@RequiredArgsConstructor
public class FingerprintBiometricReader implements BiometricReader {
    private final UserRepository userRepository;

    @Override
    public Optional<User> findByIdentifier(String identifier) {
        // Busca por el hash guardado en la BD (columna fingerprint_hash)
        return userRepository.findByFingerprintHash(identifier);
    }
}
