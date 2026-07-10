package com.marioorlando.gymaccess.controller;

import com.marioorlando.gymaccess.dto.AccessResponse;
import com.marioorlando.gymaccess.dto.ScanRequest;
import com.marioorlando.gymaccess.service.AccessService;
import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.Duration;

@RestController
@RequestMapping("/api/v1/access")
public class AccessController {

    private final AccessService accessService;
    private final Bucket bucket;

    public AccessController(AccessService accessService) {
        this.accessService = accessService;
        
        // Resilience4j/Bucket4j - Seguridad Anti Fuerza Bruta (5 intentos por minuto MÁXIMO)
        Bandwidth limit = Bandwidth.builder()
                .capacity(5)
                .refillGreedy(5, Duration.ofMinutes(1))
                .build();
        this.bucket = Bucket.builder().addLimit(limit).build();
    }

    @PostMapping("/scan")
    public ResponseEntity<?> scanAccess(@Valid @RequestBody ScanRequest request) {
        
        if (bucket.tryConsume(1)) {
            AccessResponse response = accessService.processAccess(request);
            return ResponseEntity.ok(response);
        }
        
        return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body("Demasiados intentos. Bloqueo temporal por seguridad.");
    }
}
