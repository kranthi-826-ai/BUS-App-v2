package com.smartbus.auth.service;

import com.smartbus.auth.dto.AuthResponse;
import com.smartbus.auth.dto.LoginRequest;
import com.smartbus.auth.security.JwtService;
import com.smartbus.common.entity.RefreshToken;
import com.smartbus.common.entity.User;
import com.smartbus.common.repository.RefreshTokenRepository;
import com.smartbus.common.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, 
                       PasswordEncoder passwordEncoder, JwtService jwtService) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }

        if (!"ACTIVE".equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }
        
        String familyId = UUID.randomUUID().toString();
        return issueTokens(user, familyId);
    }

    @Transactional(noRollbackFor = ResponseStatusException.class)
    public AuthResponse refresh(String tokenString) {
        String[] parts = tokenString.split("::");
        if (parts.length != 2) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token format");
        }
        String tokenId = parts[0];
        String tokenSecret = parts[1];

        RefreshToken rt = refreshTokenRepository.findById(tokenId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token"));
        
        if (!passwordEncoder.matches(tokenSecret, rt.getTokenHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid token secret");
        }

        // Check if token is already rotated or revoked (Reuse Detection)
        if (rt.getRotatedAt() != null || rt.getRevokedAt() != null) {
            // Revoke the entire family due to token reuse
            refreshTokenRepository.findAll().stream()
                .filter(t -> t.getFamilyId().equals(rt.getFamilyId()))
                .forEach(t -> {
                    t.setRevokedAt(Instant.now());
                    refreshTokenRepository.save(t);
                });
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token reuse detected, family revoked");
        }
        
        if (rt.getExpiry().isBefore(Instant.now())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Token expired");
        }

        User user = rt.getUser();
        if (!"ACTIVE".equals(user.getStatus())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Account disabled");
        }

        // Mark current token as rotated
        rt.setRotatedAt(Instant.now());
        refreshTokenRepository.save(rt);

        // Issue new tokens in the same family
        return issueTokens(user, rt.getFamilyId());
    }
    
    private AuthResponse issueTokens(User user, String familyId) {
        String accessToken = jwtService.generateToken(user.getId(), user.getRole());
        
        String tokenId = UUID.randomUUID().toString();
        String tokenSecret = UUID.randomUUID().toString();
        String fullToken = tokenId + "::" + tokenSecret;
        
        RefreshToken rt = new RefreshToken();
        rt.setId(tokenId);
        rt.setUser(user);
        rt.setTokenHash(passwordEncoder.encode(tokenSecret));
        rt.setFamilyId(familyId);
        rt.setExpiry(Instant.now().plus(30, ChronoUnit.DAYS));
        rt.setCreatedAt(Instant.now());
        
        refreshTokenRepository.save(rt);

        return new AuthResponse(accessToken, fullToken, user.getRole(), user.getId());
    }

    @Transactional
    public void logout(String tokenString) {
        String[] parts = tokenString.split("::");
        if (parts.length != 2) return; // Fail silently on invalid format for logout
        
        String tokenId = parts[0];
        String tokenSecret = parts[1];

        Optional<RefreshToken> rtOpt = refreshTokenRepository.findById(tokenId);
        if (rtOpt.isPresent()) {
            RefreshToken rt = rtOpt.get();
            if (passwordEncoder.matches(tokenSecret, rt.getTokenHash())) {
                rt.setRevokedAt(Instant.now());
                refreshTokenRepository.save(rt);
            }
        }
    }
}
