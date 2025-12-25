package com.library.backend.config;

import com.library.backend.entity.Role;
import com.library.backend.entity.User;
import com.library.backend.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DatabaseInitializer {

    @Bean
    CommandLineRunner initDatabase(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            // Check if Main Admin exists, if not, create it
            if (userRepository.findByUsername("admin1").isEmpty()) {
                User admin1 = User.builder()
                        .username("admin1")
                        .password(passwordEncoder.encode("mypassword123")) // Change this!
                        .email("admin1@library.com")
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin1);
                System.out.println("Admin 1 created");
            }

            // Check if Second Admin exists
            if (userRepository.findByUsername("admin2").isEmpty()) {
                User admin2 = User.builder()
                        .username("admin2")
                        .password(passwordEncoder.encode("mypassword456")) // Change this!
                        .email("admin2@library.com")
                        .role(Role.ADMIN)
                        .build();
                userRepository.save(admin2);
                System.out.println("Admin 2 created");
            }
        };
    }
}