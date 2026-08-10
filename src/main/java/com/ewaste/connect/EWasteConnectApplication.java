package com.ewaste.connect;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class EWasteConnectApplication {

    public static void main(String[] args) {
        SpringApplication.run(EWasteConnectApplication.class, args);
        System.out.println("\n========================================================");
        System.out.println("🌱 E-Waste Connect Spring Boot Application Started!");
        System.out.println("🌐 Web Frontend: http://localhost:8080");
        System.out.println("📡 REST Providers API: http://localhost:8080/api/providers");
        System.out.println("📡 REST Requests API:  http://localhost:8080/api/requests");
        System.out.println("💾 H2 Console:        http://localhost:8080/h2-console");
        System.out.println("========================================================\n");
    }
}
