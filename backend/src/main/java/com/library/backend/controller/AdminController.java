package com.library.backend.controller;

import com.library.backend.entity.User;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Slf4j // Add this for logging
public class AdminController {

    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        try {
            log.info("Fetching dashboard stats...");
            log.info("BookRepository: {}", bookRepository);
            log.info("Book count query: {}", bookRepository.count());
            log.info("User count query: {}", userRepository.count());

            Map<String, Long> stats = new HashMap<>();

            // Count all books
            long bookCount = bookRepository.count();
            stats.put("totalBooks", bookCount);

            // Count all users (including admins)
            long userCount = userRepository.count();
            stats.put("totalUsers", userCount);

            // Placeholder for future logic (Borrowed books)
            stats.put("activeLoans", 0L);

            log.info("Stats calculated - Books: {}, Users: {}", bookCount, userCount);
            return ResponseEntity.ok(stats);
        } catch (Exception e) {
            log.error("Error fetching dashboard stats", e);
            Map<String, Long> errorStats = new HashMap<>();
            errorStats.put("totalBooks", 0L);
            errorStats.put("totalUsers", 0L);
            errorStats.put("activeLoans", 0L);
            return ResponseEntity.ok(errorStats); // Return zeros on error
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

                        return userMap;
                    })
                    .collect(Collectors.toList());

            return ResponseEntity.ok(userList);
        } catch (Exception e) {
            log.error("Error fetching users", e);
            return ResponseEntity.internalServerError().build();
        }
    }

    // Optional: Add endpoint to delete a user
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