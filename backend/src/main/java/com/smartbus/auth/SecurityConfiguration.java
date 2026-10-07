package com.smartbus.auth;
import org.springframework.context.annotation.*;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
@Configuration public class SecurityConfiguration {
 @Bean PasswordEncoder passwordEncoder(){return new BCryptPasswordEncoder();}
 @Bean SecurityFilterChain security(HttpSecurity http,JwtAuthenticationFilter jwt)throws Exception{return http.csrf(c->c.disable()).addFilterBefore(jwt,UsernamePasswordAuthenticationFilter.class).authorizeHttpRequests(a->a.requestMatchers("/api/v1/health","/api/v1/auth/login","/actuator/health").permitAll().requestMatchers("/api/v1/admin/**").hasRole("ADMIN").requestMatchers("/api/v1/trips/**").hasAnyRole("DRIVER","ADMIN").requestMatchers("/api/v1/subscription/**","/api/v1/alerts/**","/api/v1/notifications/**").hasAnyRole("STUDENT","ADMIN").anyRequest().authenticated()).build();}
}
