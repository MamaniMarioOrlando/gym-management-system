package com.marioorlando.gymaccess.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Deshabilitamos CSRF temporalmente para desarrollo de la API
            .authorizeHttpRequests(authz -> authz
                // Permite acceso libre a Swagger UI y a la documentación OpenAPI
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Toda otra petición requiere autenticación (por ahora, hasta que hagamos el JWT)
                .anyRequest().authenticated()
            )
            .httpBasic(httpBasic -> {}); // Habilita autenticación básica tipo Popup

        return http.build();
    }
}
