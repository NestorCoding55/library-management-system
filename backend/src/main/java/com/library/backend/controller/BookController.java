package com.library.backend.controller;

import com.library.backend.entity.Book;
import com.library.backend.service.BookService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList; // Import this
import java.util.List;

@RestController
@RequestMapping("/api/books")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookController {
    private final BookService bookService;

    // --- 1. ADD THIS INTERNAL CLASS ---
    // This defines what a "Category" looks like for the frontend
    static class CategoryDTO {
        public Long id;
        public String name;
        public String description;

        public CategoryDTO(Long id, String name, String description) {
            this.id = id;
            this.name = name;
            this.description = description;
        }
    }

    // --- 2. ADD THIS NEW ENDPOINT ---
    // This will be accessed at: http://localhost:8080/api/books/categories
    @GetMapping("/categories")
    public List<CategoryDTO> getAllCategories() {
        List<CategoryDTO> list = new ArrayList<>();
        list.add(new CategoryDTO(1L, "Science Fiction", "Explore the future and beyond."));
        list.add(new CategoryDTO(2L, "History", "Learn from the past."));
        list.add(new CategoryDTO(3L, "Technology", "Computers, coding, and AI."));
        list.add(new CategoryDTO(4L, "Romance", "Heartwarming stories."));
        list.add(new CategoryDTO(5L, "Mystery", "Solve the puzzle."));
        list.add(new CategoryDTO(6L, "Biographies", "Real lives, real stories."));
        list.add(new CategoryDTO(7L, "Fantasy", "Dragons, magic, and epic adventures."));
        return list;
    }

    // --- EXISTING METHODS BELOW (Keep these as they are) ---

    @PostMapping
    public Book createBook(@RequestBody Book book) {
        return bookService.saveBook(book);
    }

    @GetMapping
    public List<Book> getAllBooks() {
        return bookService.getAllBooks();
    }

    @GetMapping("/{id}")
    public Book getBookById(@PathVariable Long id) {
        return bookService.getBookById(id);
    }

    // Note: This one filters books. The one we added above LISTS the categories.
    @GetMapping("/category")
    public List<Book> getBooksByCategory(@RequestParam String category) {
        return bookService.getBooksByCategory(category);
    }

    @PutMapping("/{id}")
    public Book updateBook(@PathVariable Long id, @RequestBody Book updatedBook) {
        return bookService.updateBook(id, updatedBook);
    }

    @DeleteMapping("/{id}")
    public void deleteBook(@PathVariable Long id) {
        bookService.deleteBook(id);
    }

    @GetMapping("/search")
    public List<Book> searchBooks(@RequestParam String keyword) {
        return bookService.searchBooks(keyword);
    }
}