package com.library.backend.controller;

import com.library.backend.dto.RegisterRequest; // Import the DTO
import com.library.backend.entity.User;
import com.library.backend.service.AuthenticationService; // Import the Service
import jakarta.validation.Valid; // Import for validation
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth") // Kept your original path
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173") // Kept your original CORS
public class AuthController {

    private final AuthenticationService service; // Inject the Service
    private final AuthenticationManager authenticationManager; // Keep for Login

    // --- REGISTER ENDPOINT (UPDATED) ---
    @PostMapping("/register")
    public ResponseEntity<String> register(
            @Valid @RequestBody RegisterRequest request // Now using DTO + @Valid
    ) {
        // The logic is now inside the Service (checking duplicates, password, saving)
        service.register(request);

        return ResponseEntity.ok("User registered successfully!");
    }

    // --- LOGIN ENDPOINT (KEPT AS IS) ---
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        // This automatically checks the username and password against the database
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        return ResponseEntity.ok("Login Successful! (Token coming soon)");
    }
}