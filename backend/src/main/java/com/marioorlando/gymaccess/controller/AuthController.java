package com.marioorlando.gymaccess.controller;

import com.marioorlando.gymaccess.dto.AuthRequest;
import com.marioorlando.gymaccess.dto.AuthResponse;
import com.marioorlando.gymaccess.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        AuthResponse response = authService.authenticate(request);
        return ResponseEntity.ok(response);
    }
}
