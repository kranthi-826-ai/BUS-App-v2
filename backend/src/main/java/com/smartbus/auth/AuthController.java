package com.smartbus.auth;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
@RestController @RequestMapping("/api/v1/auth")
public class AuthController {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthController(UserRepository users, PasswordEncoder encoder, JwtService jwt){this.users=users;this.encoder=encoder;this.jwt=jwt;}
    @PostMapping("/login") public Map<String,Object> login(@Valid @RequestBody LoginRequest request){
        UserEntity user=users.findByEmailIgnoreCase(request.email()).orElseThrow(()->new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials"));
        if(!user.isActive() || !encoder.matches(request.password(),user.getPasswordHash())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED,"Invalid credentials");
        return Map.of("accessToken",jwt.issue(user),"userId",user.getId(),"role",user.getRole(),"displayName",user.getDisplayName());
    }
}
