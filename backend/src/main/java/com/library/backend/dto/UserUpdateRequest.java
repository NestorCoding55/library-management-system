package com.library.backend.dto;

import lombok.Data;

@Data
public class UserUpdateRequest {
    private String username;

    // For password change (Optional)
    private String currentPassword;
    private String newPassword;

    // For Profile Picture (We will send the URL string for now)
    private String profilePicUrl;
}