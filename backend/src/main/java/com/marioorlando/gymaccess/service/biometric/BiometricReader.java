package com.marioorlando.gymaccess.service.biometric;

import com.marioorlando.gymaccess.model.User;
import java.util.Optional;

// PREPARACIÓN HARDWARE
public interface BiometricReader {
    Optional<User> findByIdentifier(String identifier);
}
