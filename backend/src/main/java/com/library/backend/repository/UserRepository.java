package com.library.backend.repository;
import com.library.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    // NEEDED FOR CHECKS:
    boolean existsByEmail(String email);
    boolean existsByUsername(String username);
}
