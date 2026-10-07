package com.smartbus.auth;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
@Service
public class JwtService {
    private final byte[] key;
    public JwtService(@Value("${smartbus.jwt.secret}") String secret){ key=secret.getBytes(StandardCharsets.UTF_8); }
    public String issue(UserEntity user){ Instant now=Instant.now(); return Jwts.builder().subject(user.getId()).claim("role",user.getRole()).issuedAt(Date.from(now)).expiration(Date.from(now.plusSeconds(900))).signWith(Keys.hmacShaKeyFor(key)).compact(); }
    public io.jsonwebtoken.Claims parse(String token){ return Jwts.parser().verifyWith(Keys.hmacShaKeyFor(key)).build().parseSignedClaims(token).getPayload(); }
}
