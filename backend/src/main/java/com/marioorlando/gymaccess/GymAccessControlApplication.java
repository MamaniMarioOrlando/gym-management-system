package com.marioorlando.gymaccess;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling // Activa el motor de cron para tareas programadas (Fase 10)
@EnableAsync // Permite procesar los envíos en un ThreadPool paralelo para no bloquear el Cron Principal
public class GymAccessControlApplication {

	public static void main(String[] args) {
		SpringApplication.run(GymAccessControlApplication.class, args);
	}

}
