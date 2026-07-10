package com.marioorlando.gymaccess.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ScanRequest {
    @NotBlank(message = "El identificador escaneado no puede estar vacío")
    private String identifier;
}
