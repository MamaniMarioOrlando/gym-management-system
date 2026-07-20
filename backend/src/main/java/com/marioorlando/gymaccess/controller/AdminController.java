package com.marioorlando.gymaccess.controller;

import com.marioorlando.gymaccess.dto.CreateUserRequest;
import com.marioorlando.gymaccess.dto.RenewRequest;
import com.marioorlando.gymaccess.model.Payment;
import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.service.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

/**
 * Controlador de Dominio API puramente para el Personal de Recepción.
 */
@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;

    // Solo los administradores o recepcionistas pueden dar de alta a una persona
    @PostMapping("/users")
    public ResponseEntity<User> registerUser(@Valid @RequestBody CreateUserRequest request) {
        User createdUser = adminService.createUser(request);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    // Proceso Financiero
    @PostMapping("/users/{id}/renew")
    public ResponseEntity<Payment> renewMembership(
            @PathVariable UUID id, 
            @Valid @RequestBody RenewRequest request) {
        Payment recordedPayment = adminService.renewMembership(id, request);
        return new ResponseEntity<>(recordedPayment, HttpStatus.OK);
    }
}
