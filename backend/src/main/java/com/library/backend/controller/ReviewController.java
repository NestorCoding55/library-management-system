package com.library.backend.controller;

import com.library.backend.entity.Book;
import com.library.backend.entity.Review;
import com.library.backend.entity.User;
import com.library.backend.repository.BookRepository;
import com.library.backend.repository.ReviewRepository;
import com.library.backend.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewRepository reviewRepository;
    private final BookRepository bookRepository;
    private final UserRepository userRepository;

    @PostMapping("/add")
    public ResponseEntity<?> addReview(@RequestBody ReviewRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        // The token stores the USERNAME, not the email
        String username = auth.getName();

        // FIX: Use findByUsername, not findByEmail
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new RuntimeException("Book not found"));

        if (reviewRepository.existsByUserAndBook(user, book)) {
            return ResponseEntity.badRequest().body("You have already rated this book.");
        }

        Review review = new Review();
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        review.setUser(user);
        review.setBook(book);
        reviewRepository.save(review);

        updateBookRating(book);

        return ResponseEntity.ok("Rating submitted successfully!");
    }

    @GetMapping("/book/{bookId}")
    public ResponseEntity<List<Map<String, Object>>> getBookReviews(@PathVariable Long bookId) {
        List<Review> reviews = reviewRepository.findByBookId(bookId);

        List<Map<String, Object>> response = reviews.stream()
                .map(r -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("id", r.getId());
                    map.put("rating", r.getRating());
                    map.put("comment", r.getComment() != null ? r.getComment() : "");
                    map.put("username", r.getUser().getUsername());
                    map.put("date", r.getCreatedAt().toString());
                    return map;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    private void updateBookRating(Book book) {
        List<Review> reviews = reviewRepository.findByBookId(book.getId());
        double average = reviews.stream().mapToInt(Review::getRating).average().orElse(0.0);

        book.setAverageRating(Math.round(average * 10.0) / 10.0);
        book.setTotalVotes(reviews.size());
        bookRepository.save(book);
    }

    @Data
    static class ReviewRequest {
        private Long bookId;
        private int rating;
        private String comment;
    }
}