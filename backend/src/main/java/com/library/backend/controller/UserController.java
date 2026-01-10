package com.library.backend.controller;

import com.library.backend.dto.UserUpdateRequest;
import com.library.backend.entity.User;
import com.library.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import com.library.backend.service.ImageService; // Import
import org.springframework.web.multipart.MultipartFile;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor

public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ImageService imageService;    // <--- INJECTED for password changes

    @GetMapping("/me")
    public ResponseEntity<User> authenticatedUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        User currentUser = userRepository.findByUsername(currentUsername)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return ResponseEntity.ok(currentUser);
    }

    @PostMapping("/upload-photo")
    public ResponseEntity<User> uploadProfilePhoto(@RequestParam("file") MultipartFile file) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // --- REMOVED SECURITY CHECK FOR PHOTOS (Optional) ---
        // People often want to change pics. We only lock username/password updates.

        // 1. Save File & Run AI Check
        String photoUrl = imageService.saveImage(file);

        // 2. Update User (BUT DO NOT UPDATE THE TIMER)
        user.setProfilePicUrl(photoUrl);
        // user.setLastProfileUpdate(LocalDateTime.now()); <--- COMMENT THIS OUT

        return ResponseEntity.ok(userRepository.save(user));
    }

    // ... inside UserController class ...

    // --- NEW: CHECK USERNAME AVAILABILITY ---
    @GetMapping("/check-username")
    public ResponseEntity<java.util.Map<String, Boolean>> checkUsernameAvailability(@RequestParam String username) {
        // Check if username exists in DB
        boolean exists = userRepository.existsByUsername(username);

        // Return JSON: { "available": true/false }
        return ResponseEntity.ok(java.util.Map.of("available", !exists));
    }

    // --- NEW: UPDATE PROFILE ENDPOINT ---
    @PutMapping("/me")
    public ResponseEntity<User> updateProfile(@RequestBody UserUpdateRequest request) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // --- 1. SECURITY COOLDOWN CHECK (30 Days) ---
        // We allow them to update if:
        // A. They have NEVER updated before (null)
        // B. OR it has been more than 30 days since the last update
        if (user.getLastProfileUpdate() != null &&
                user.getLastProfileUpdate().plusDays(30).isAfter(java.time.LocalDateTime.now())) {

            // Calculate days remaining for the error message
            long daysLeft = java.time.temporal.ChronoUnit.DAYS.between(
                    java.time.LocalDateTime.now(),
                    user.getLastProfileUpdate().plusDays(30)
            );

            throw new RuntimeException("Security Limit: You can only edit your profile once every 30 days. Please wait " + daysLeft + " more days.");
        }

        boolean isDataChanged = false; // Track if we actually need to save/lock

        // --- 2. Update Username ---
        if (request.getUsername() != null && !request.getUsername().isBlank()
                && !request.getUsername().equals(user.getUsername())) {

            if (userRepository.existsByUsername(request.getUsername())) {
                throw new RuntimeException("Username '" + request.getUsername() + "' is already taken.");
            }
            user.setUsername(request.getUsername());
            isDataChanged = true;
        }

        // --- 3. Update Password ---
        if (request.getNewPassword() != null && !request.getNewPassword().isBlank()) {
            if (request.getCurrentPassword() == null || !passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("Incorrect current password.");
            }
            // Note: We will handle "Confirm Password" check on Frontend,
            // but Backend accepts the final valid password.
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            isDataChanged = true;
        }

        // --- 4. Update Profile Pic ---
        if (request.getProfilePicUrl() != null && !request.getProfilePicUrl().equals(user.getProfilePicUrl())) {
            user.setProfilePicUrl(request.getProfilePicUrl());
            isDataChanged = true;
        }

        // --- 5. Final Save ---
        if (isDataChanged) {
            user.setLastProfileUpdate(java.time.LocalDateTime.now()); // Reset the 30-day timer
            return ResponseEntity.ok(userRepository.save(user));
        } else {
            return ResponseEntity.ok(user); // No changes made, no timer reset needed
        }
    }
}