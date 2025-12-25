package com.library.backend.service;

import com.library.backend.dto.RegisterRequest;
import com.library.backend.entity.Role; // Assuming you have an Enum or String for roles
import com.library.backend.entity.User;
import com.library.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        // 1. Check if user exists
        if (repository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already in use");
        }
        if (repository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username is already taken");
        }

        // 2. Create the real User Entity
        var user = User.builder() // Assuming you actived @Builder in Lombok
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // Encrypt!
                .role(Role.USER) // Default role
                .build();

        // 3. Save to DB
        repository.save(user);
    }
}