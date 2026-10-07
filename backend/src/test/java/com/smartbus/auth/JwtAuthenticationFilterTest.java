package com.smartbus.auth;
import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.*;
import org.springframework.mock.web.*;
import org.springframework.security.core.context.SecurityContextHolder;
class JwtAuthenticationFilterTest {
 private final JwtService jwt=new JwtService("test-secret-with-at-least-thirty-two-bytes-123");
 @AfterEach void clear(){SecurityContextHolder.clearContext();}
 @Test void authenticatesValidBearerToken() throws Exception {
  UserEntity user=new UserEntity();user.setRole("ADMIN");
  MockHttpServletRequest request=new MockHttpServletRequest();
  request.addHeader("Authorization","Bearer "+jwt.issue(user));
  new JwtAuthenticationFilter(jwt).doFilter(request,new MockHttpServletResponse(),(req,res)->{});
  assertEquals(user.getId(),SecurityContextHolder.getContext().getAuthentication().getName());
  assertTrue(SecurityContextHolder.getContext().getAuthentication().getAuthorities().stream().anyMatch(a->a.getAuthority().equals("ROLE_ADMIN")));
 }
 @Test void ignoresMalformedBearerToken() throws Exception {
  MockHttpServletRequest request=new MockHttpServletRequest();request.addHeader("Authorization","Bearer not-a-token");
  new JwtAuthenticationFilter(jwt).doFilter(request,new MockHttpServletResponse(),(req,res)->{});
  assertNull(SecurityContextHolder.getContext().getAuthentication());
 }
}
