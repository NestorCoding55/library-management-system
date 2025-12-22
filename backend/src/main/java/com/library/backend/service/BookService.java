package com.library.backend.service;
import java.util.List;
import com.library.backend.entity.Book;
import com.library.backend.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BookService {
    private final BookRepository bookRepository;

    public Book saveBook(Book book) {
        return bookRepository.save(book);
    }

    public List<Book> getAllBooks() {
        return bookRepository.findAll();
    }

    public Book getBookById(Long id) {
        return bookRepository.findById(id).orElse(null);
    }

    public List<Book> getBooksByCategory(String category) {
        return bookRepository.findByCategoryIgnoreCase(category);
    }

    public Book updateBook(Long id, Book updatedBook) {
        // First, check if the book exists
        Book existingBook = bookRepository.findById(id).orElse(null);

        if (existingBook != null) {
            // Update the fields
            existingBook.setTitle(updatedBook.getTitle());
            existingBook.setAuthor(updatedBook.getAuthor());
            existingBook.setIsbn(updatedBook.getIsbn());
            existingBook.setAvailable(updatedBook.isAvailable());

            // Save the updated version
            return bookRepository.save(existingBook);
        }
        return null; // Return null if book wasn't found
    }

    public List<Book> searchBooks(String keyword) {
        return bookRepository.findByTitleContainingIgnoreCase(keyword);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }
}
