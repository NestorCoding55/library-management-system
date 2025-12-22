package com.library.backend.repository;

import com.library.backend.entity.Book;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {
    List<Book> findByCategoryIgnoreCase(String category);
    // inside BookRepository interface
    List<Book> findByTitleContainingIgnoreCase(String keyword);
}
