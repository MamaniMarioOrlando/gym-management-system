package com.marioorlando.gymaccess.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    // --- Legacy Fields (Retained for V1/V2 compatibility) ---
    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) 
    private String password;

    @Column(name = "biometric_id", unique = true)
    private String biometricId;

    @Column(nullable = false)
    private String role; // "ROLE_MEMBER" or "ROLE_ADMIN"

    // --- Phase 6: Membership & Kiosk Details ---
    @Column(nullable = false, unique = true, length = 20)
    private String dni;

    @Column(name = "full_name", nullable = false, length = 150)
    private String fullName;

    @Column(name = "birth_date")
    private LocalDate birthDate;

    @Column(name = "membership_expiry_date")
    private LocalDateTime membershipExpiryDate;

    @Column(name = "fingerprint_hash")
    private String fingerprintHash;

    @Column(length = 20)
    private String phone;
}
