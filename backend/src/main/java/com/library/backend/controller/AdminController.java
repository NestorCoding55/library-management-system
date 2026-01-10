package com.library.backend.controller;

import com.library.backend.entity.User;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.UserRepository;
import com.library.backend.repository.LoanRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime; // <--- ADDED THIS IMPORT
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;
    private final LoanRepository loanRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        try {
            Map<String, Long> stats = new HashMap<>();

            // Count all books
            stats.put("totalBooks", bookRepository.count());

            // Count all users
            stats.put("totalUsers", userRepository.count());

            // UPDATED: Count active loans that have NOT expired yet
            // This passes the current time to the repository to filter out old dates
            stats.put("activeLoans", loanRepository.countByIsActiveTrueAndExpiryDateAfter(LocalDateTime.now()));

            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            // Return safe zeros on error
            Map<String, Long> errorStats = new HashMap<>();
            errorStats.put("totalBooks", 0L);
            errorStats.put("totalUsers", 0L);
            errorStats.put("activeLoans", 0L);
            return ResponseEntity.ok(errorStats);
        }
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        try {
            List<User> users = userRepository.findAll();

            List<Map<String, Object>> userList = users.stream()
                    .map(user -> {
                        Map<String, Object> userMap = new HashMap<>();
                        userMap.put("id", user.getId());
                        userMap.put("username", user.getUsername());
                        userMap.put("email", user.getEmail());
                        userMap.put("role", user.getRole());

                        // Send the creation date so "Joined" column works
                        userMap.put("createdAt", user.getCreatedAt());

                        return userMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            if (userRepository.existsById(id)) {
                userRepository.deleteById(id);
                return ResponseEntity.ok().build();
            }
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            log.error("Error deleting user with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}