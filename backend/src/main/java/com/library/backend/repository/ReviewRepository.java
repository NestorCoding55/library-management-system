package com.library.backend.repository;

import com.library.backend.entity.Review;
import com.library.backend.entity.User;
import com.library.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByBookId(Long bookId);
    boolean existsByUserAndBook(User user, Book book);
}