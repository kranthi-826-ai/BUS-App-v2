package com.smartbus.auth;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.*;
import java.io.IOException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {
 private final JwtService jwt;
 public JwtAuthenticationFilter(JwtService jwt){this.jwt=jwt;}
 @Override protected void doFilterInternal(HttpServletRequest req,HttpServletResponse res,FilterChain chain)throws ServletException,IOException{
  String h=req.getHeader("Authorization");
  if(h!=null&&h.startsWith("Bearer ")) try { var c=jwt.parse(h.substring(7)); var a=new UsernamePasswordAuthenticationToken(c.getSubject(),null,java.util.List.of(new SimpleGrantedAuthority("ROLE_"+c.get("role",String.class)))); SecurityContextHolder.getContext().setAuthentication(a); } catch(Exception ignored) {}
  chain.doFilter(req,res);
 }
}
