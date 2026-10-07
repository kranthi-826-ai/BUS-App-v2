package com.smartbus.auth;

import jakarta.persistence.*;
import java.util.UUID;

@Entity @Table(name="app_users")
public class UserEntity {
    @Id private String id = UUID.randomUUID().toString();
    @Column(nullable=false, unique=true) private String email;
    @Column(name="password_hash", nullable=false) private String passwordHash;
    @Column(nullable=false) private String role;
    @Column(name="display_name", nullable=false) private String displayName;
    @Column(nullable=false) private boolean active = true;
    public String getId(){return id;} public String getEmail(){return email;} public void setEmail(String v){email=v;}
    public String getPasswordHash(){return passwordHash;} public void setPasswordHash(String v){passwordHash=v;}
    public String getRole(){return role;} public void setRole(String v){role=v;} public String getDisplayName(){return displayName;} public void setDisplayName(String v){displayName=v;}
    public boolean isActive(){return active;} public void setActive(boolean v){active=v;}
}
