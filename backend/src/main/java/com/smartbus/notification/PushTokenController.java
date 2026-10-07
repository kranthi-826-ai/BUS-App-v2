package com.smartbus.notification;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.security.Principal;
import java.time.Instant;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
record PushTokenRequest(@NotBlank String expoPushToken,@NotBlank String platform){}
@RestController @RequestMapping("/api/v1/device-push-tokens")
public class PushTokenController {
 private final JdbcTemplate jdbc;
 public PushTokenController(JdbcTemplate jdbc){this.jdbc=jdbc;}
 @PutMapping public Map<String,Object> register(Principal principal,@Valid @RequestBody PushTokenRequest request){
  if(principal==null) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
  String id=UUID.randomUUID().toString(); Instant now=Instant.now();
  jdbc.update("INSERT INTO device_push_tokens(id,user_id,expo_push_token,platform,created_at,updated_at) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE user_id=VALUES(user_id),platform=VALUES(platform),updated_at=VALUES(updated_at)",id,principal.getName(),request.expoPushToken(),request.platform(),now,now);
  return Map.of("registered",true);
 }
}
