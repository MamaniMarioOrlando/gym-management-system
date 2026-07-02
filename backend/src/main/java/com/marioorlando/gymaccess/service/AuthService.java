package com.marioorlando.gymaccess.service;

import com.marioorlando.gymaccess.dto.AuthRequest;
import com.marioorlando.gymaccess.dto.AuthResponse;
import com.marioorlando.gymaccess.model.User;
import com.marioorlando.gymaccess.repository.UserRepository;
import com.marioorlando.gymaccess.security.JwtService;
import com.marioorlando.gymaccess.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse authenticate(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
                
        String jwtToken = jwtService.generateToken(new UserDetailsImpl(user));
        
        return AuthResponse.builder()
                .token(jwtToken)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}
