package com.marioorlando.gymaccess.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AccessResponse {
    private boolean granted;
    private String fullName;
    private LocalDateTime expiryDate;
    private String message;
}
