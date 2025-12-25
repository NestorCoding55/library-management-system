package com.library.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data; // If you use Lombok, otherwise write Getters/Setters

@Data
public class RegisterRequest {

    @NotBlank(message = "Username is required")
    private String username;

    @Email(message = "Email must be valid")
    @NotBlank(message = "Email is required")
    private String email;

    // This is the "Difficult" password rule you asked for
    @Pattern(
            regexp = "^(?=(?:.*\\d){5})(?=(?:.*[a-zA-Z]){5})(?=.*[^a-zA-Z0-9]).{12,24}$",
            message = "Password must be 12-24 chars, with at least 5 numbers, 5 letters, and 1 special char."
    )
    private String password;
}