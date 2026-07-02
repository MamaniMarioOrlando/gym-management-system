package com.marioorlando.gymaccess.model;

import jakarta.persistence.*;
import lombok.*;
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

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = true) // Nullable for members who might just use fingerprints
    private String password;

    // We store the biometric hash/id provided by the scanner
    @Column(name = "biometric_id", unique = true)
    private String biometricId;

    @Column(nullable = false)
    private String role; // "ROLE_MEMBER" or "ROLE_ADMIN"
}
