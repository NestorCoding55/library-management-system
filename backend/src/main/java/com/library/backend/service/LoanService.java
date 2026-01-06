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
import java.util.ArrayList;
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

        if (user.getRole() == com.library.backend.entity.Role.ADMIN) {
            throw new RuntimeException("Administrators cannot rent books. Please use a User account.");
        }

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

        // OLD: return loanRepository.existsByUserAndBookAndIsActiveTrue(user, book);

        // NEW FIX: Check that it is Active AND the Date is still valid
        return loanRepository.findByUserAndIsActiveTrue(user).stream()
                .anyMatch(loan ->
                        loan.getBook().getId().equals(bookId) &&
                                loan.getExpiryDate().isAfter(LocalDateTime.now())
                );
    }

    // For Admin Dashboard
    public List<Loan> getAllActiveLoans() {
        // In a real app, you might want a custom query for this, but this works for now
        return loanRepository.findAll().stream()
                .filter(Loan::isActive)
                .collect(Collectors.toList());
    }

    // inside LoanService.java

    public void returnBook(Long loanId, String username) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new RuntimeException("Loan not found"));

        // Security check: Ensure the user actually owns this loan
        if (!loan.getUser().getUsername().equals(username)) {
            throw new RuntimeException("You are not authorized to return this book.");
        }

        // "Return" the book:
        // 1. Set active to false
        loan.setActive(false);
        // 2. Set expiry date to NOW (so it appears in history logic immediately)
        loan.setExpiryDate(LocalDateTime.now());

        loanRepository.save(loan);
    }

    // inside LoanService class

    // ... inside LoanService class ...

    public List<Loan> getReadingHistory(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Loan> allLoans = loanRepository.findByUser(user);

        // 1. Filter for Expired/Returned loans
        List<Loan> expiredLoans = allLoans.stream()
                .filter(loan -> loan.getExpiryDate().isBefore(LocalDateTime.now()))
                .collect(Collectors.toList());

        // 2. Filter for UNIQUE books (Keep only the most recent rental per book)
        java.util.Map<Long, Loan> uniqueHistoryMap = new java.util.HashMap<>();

        for (Loan loan : expiredLoans) {
            Long bookId = loan.getBook().getId();

            // If we haven't seen this book yet, OR this loan is newer than the one we stored...
            if (!uniqueHistoryMap.containsKey(bookId) ||
                    loan.getExpiryDate().isAfter(uniqueHistoryMap.get(bookId).getExpiryDate())) {

                uniqueHistoryMap.put(bookId, loan); // ...update the map with this loan
            }
        }

        // 3. Return the unique values
        return new ArrayList<>(uniqueHistoryMap.values());
    }
}