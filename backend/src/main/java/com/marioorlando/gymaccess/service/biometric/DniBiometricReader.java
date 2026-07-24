package com.marioorlando.gymaccess.service.biometric;

import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.util.Optional;

// PREPARACIÓN HARDWARE
@Service
@Primary
@Profile({"dev", "default"}) // Se activa en desarrollo o cuando no se especifica nada
@RequiredArgsConstructor
public class DniBiometricReader implements BiometricReader {
    private final UserRepository userRepository;

    @Override
    public Optional<User> findByIdentifier(String identifier) {
        return userRepository.findByDni(identifier);
    }
}
