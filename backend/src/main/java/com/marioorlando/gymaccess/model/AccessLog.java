package com.marioorlando.gymaccess.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "access_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AccessLog {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "access_time", nullable = false)
    private LocalDateTime accessTime;

    @Column(name = "granted", nullable = false)
    private boolean granted;

    // "MEMBERSHIP_EXPIRED", "UNRECOGNIZED_FINGERPRINT", "SUCCESS"
    @Column(name = "reason")
    private String reason; 
}
