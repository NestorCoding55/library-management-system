package com.library.backend.controller;

import com.library.backend.entity.Loan;
import com.library.backend.service.LoanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class LoanController {

    private final LoanService loanService;

    // 1. Rent a Book
    @PostMapping("/rent/{bookId}")
    public ResponseEntity<Loan> rentBook(@PathVariable Long bookId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return ResponseEntity.ok(loanService.rentBook(bookId, username));
    }

    // 2. Get My Active Rentals (My Books)
    @GetMapping("/my-books")
    public ResponseEntity<List<Loan>> getMyBooks() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String username = auth.getName();

        return ResponseEntity.ok(loanService.getMyActiveLoans(username));
    }

    // 3. Admin: View All Active Rentals
    @GetMapping("/admin/active")
    public ResponseEntity<List<Loan>> getAllActiveLoans() {
        // SecurityConfig already protects /api/loans/admin/** endpoints if configured,
        // but we can add a check here or rely on the global config.
        // Ideally, update SecurityConfig to restrict /api/loans/admin/** to ADMIN role.
        return ResponseEntity.ok(loanService.getAllActiveLoans());
    }

    // inside LoanController class

    // 4. Check if current user has rented a specific book
    @GetMapping("/check/{bookId}")
    public ResponseEntity<Boolean> checkLoanStatus(@PathVariable Long bookId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
            return ResponseEntity.ok(false); // Not logged in -> Not rented
        }

        String username = auth.getName();
        return ResponseEntity.ok(loanService.isBookRentedByUser(bookId, username));
    }
}