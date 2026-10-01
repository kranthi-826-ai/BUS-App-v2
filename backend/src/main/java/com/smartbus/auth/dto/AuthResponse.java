package com.smartbus.auth.dto;

public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private String role;
    private String userId;

    public AuthResponse(String accessToken, String refreshToken, String role, String userId) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.role = role;
        this.userId = userId;
    }

    public String getAccessToken() { return accessToken; }
    public String getRefreshToken() { return refreshToken; }
    public String getRole() { return role; }
    public String getUserId() { return userId; }
}
