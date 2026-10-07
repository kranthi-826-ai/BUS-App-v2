package com.smartbus.admin;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/admin")
public class AdminController {
 private final JdbcTemplate jdbc;
 public AdminController(JdbcTemplate jdbc){this.jdbc=jdbc;}
 @GetMapping("/dashboard") public Map<String,Object> dashboard(){return Map.of("users",count("app_users"),"routes",count("routes"),"buses",count("buses"),"activeTrips",jdbc.queryForObject("SELECT COUNT(*) FROM trips WHERE status='STARTED'",Long.class),"notifications",count("notifications"));}
 private long count(String table){Long value=jdbc.queryForObject("SELECT COUNT(*) FROM "+table,Long.class);return value==null?0:value;}
}
