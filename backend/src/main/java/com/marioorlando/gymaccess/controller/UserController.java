package com.marioorlando.gymaccess.controller;

import com.marioorlando.gymaccess.dto.UserDto;
import com.marioorlando.gymaccess.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Tag(name = "Users", description = "Endpoints de administración de Usuarios y Staff")
public class UserController {

    private final UserService userService;

    @GetMapping
    @Operation(summary = "Obtener lista de todos los usuarios", description = "Devuelve un resumen de todos los usuarios del gimnasio sin exponer datos biométricos.")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        List<UserDto> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }
}
