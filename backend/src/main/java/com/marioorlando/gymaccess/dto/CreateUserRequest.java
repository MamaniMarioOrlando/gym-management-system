package com.marioorlando.gymaccess.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDate;

@Data
public class CreateUserRequest {
    
    @NotBlank(message = "El DNI es obligatorio para acceder por el Tótem")
    private String dni;
    
    @NotBlank(message = "El nombre completo es obligatorio")
    private String fullName;
    
    @Email(message = "El formato de correo no es válido")
    @NotBlank(message = "El correo electrónico es obligatorio")
    private String email;
    
    // Opcionales para el MVP
    private LocalDate birthDate;
    private String phone;
}
