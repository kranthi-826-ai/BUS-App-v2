package com.smartbus.auth;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.Test;
class JwtServiceTest {
 private final JwtService service=new JwtService("test-secret-with-at-least-thirty-two-bytes-123");
 @Test void issuesSignedRoleAndSubject(){
  UserEntity user=new UserEntity(); user.setRole("DRIVER");
  var claims=service.parse(service.issue(user));
  assertEquals(user.getId(),claims.getSubject());
  assertEquals("DRIVER",claims.get("role",String.class));
 }
 @Test void rejectsTamperedToken(){
  UserEntity user=new UserEntity(); user.setRole("STUDENT");
  String token=service.issue(user);
  assertThrows(Exception.class,()->service.parse(token.substring(0,token.length()-2)+"xx"));
 }
}
