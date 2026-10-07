package com.smartbus.auth;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.*;
@Configuration @Profile("dev")
public class DevSeedConfiguration {
 @Bean CommandLineRunner seed(UserRepository users, org.springframework.security.crypto.password.PasswordEncoder encoder){return args->{seed(users,encoder,"student@test.com","student123","STUDENT","Demo Student");seed(users,encoder,"driver@test.com","driver123","DRIVER","Demo Driver");seed(users,encoder,"admin@test.com","admin123","ADMIN","Demo Admin");};}
 private void seed(UserRepository r, org.springframework.security.crypto.password.PasswordEncoder e,String email,String pass,String role,String name){if(r.findByEmailIgnoreCase(email).isEmpty()){UserEntity u=new UserEntity();u.setEmail(email);u.setPasswordHash(e.encode(pass));u.setRole(role);u.setDisplayName(name);r.save(u);}}
}
