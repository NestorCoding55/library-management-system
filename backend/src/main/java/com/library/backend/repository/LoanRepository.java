package com.library.backend.repository;

import com.library.backend.entity.Loan;
import com.library.backend.entity.User;
import com.library.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface LoanRepository extends JpaRepository<Loan, Long> {

    // Find all loans for a specific user (for History)
    List<Loan> findByUser(User user);

    // Find only ACTIVE loans for a user (for "My Books" / Access check)
    List<Loan> findByUserAndIsActiveTrue(User user);

    // Check if a specific user has an active loan for a specific book
    boolean existsByUserAndBookAndIsActiveTrue(User user, Book book);
}