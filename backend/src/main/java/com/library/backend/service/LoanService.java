package com.library.backend.service;

import com.library.backend.entity.Book;
import com.library.backend.entity.Loan;
import com.library.backend.entity.User;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.LoanRepository;
import com.library.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepository loanRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    public Loan rentBook(Long bookId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        // 1. Fetch all "technically active" loans from DB
        List<Loan> dbActiveLoans = loanRepository.findByUserAndIsActiveTrue(user);

        // 2. Filter: Count how many are ACTUALLY valid (expiry date is in the future)
        long actualActiveLoansCount = dbActiveLoans.stream()
                .filter(loan -> loan.getExpiryDate().isAfter(LocalDateTime.now()))
                .count();

        // 3. ENFORCE LIMIT: If they have 1 or more, block the new rental
        if (actualActiveLoansCount >= 1) {
            throw new RuntimeException("Limit Reached: You can only have 1 active book at a time.");
        }

        // 4. Create the new Loan
        Loan loan = Loan.builder()
                .user(user)
                .book(book)
                .loanDate(LocalDateTime.now())
                .expiryDate(LocalDateTime.now().plusDays(3))
                .isActive(true)
                .price(5.00)
                .build();

        return loanRepository.save(loan);
    }

    public List<Loan> getMyActiveLoans(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Fetch active loans from DB
        List<Loan> loans = loanRepository.findByUserAndIsActiveTrue(user);

        // Filter out any that expired but flag hasn't been updated yet (Double check)
        return loans.stream()
                .filter(loan -> loan.getExpiryDate().isAfter(LocalDateTime.now()))
                .collect(Collectors.toList());
    }

    // inside LoanService class
    public boolean isBookRentedByUser(Long bookId, String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new RuntimeException("Book not found"));

        return loanRepository.existsByUserAndBookAndIsActiveTrue(user, book);
    }

    // For Admin Dashboard
    public List<Loan> getAllActiveLoans() {
        // In a real app, you might want a custom query for this, but this works for now
        return loanRepository.findAll().stream()
                .filter(Loan::isActive)
                .collect(Collectors.toList());
    }
}