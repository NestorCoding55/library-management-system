package com.library.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ImageService {

    private final Path fileStorageLocation;

    public ImageService() {
        // Create 'uploads' folder in project root
        this.fileStorageLocation = Paths.get("./uploads").toAbsolutePath().normalize();
        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (Exception ex) {
            throw new RuntimeException("Could not create upload directory.", ex);
        }
    }

    public String saveImage(MultipartFile file) {
        // 1. "AI" Safety Check Simulation
        performAISafetyCheck(file);

        // 2. Generate unique filename
        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();

        try {
            // 3. Save File
            Path targetLocation = this.fileStorageLocation.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            // 4. Return the URL
            return "http://localhost:8080/uploads/" + fileName;

        } catch (IOException ex) {
            throw new RuntimeException("Could not store file. Please try again!", ex);
        }
    }

    private void performAISafetyCheck(MultipartFile file) {
        try {
            System.out.println("🤖 AI Agent: Scanning image...");
            Thread.sleep(1500); // Simulate 1.5s processing time

            // Placeholder Logic: Reject files with "virus" in the name
            if (file.getOriginalFilename() != null && file.getOriginalFilename().toLowerCase().contains("virus")) {
                throw new RuntimeException("AI Security Alert: Unsafe content detected.");
            }

            System.out.println("✅ AI Agent: Image passed safety check.");
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
}