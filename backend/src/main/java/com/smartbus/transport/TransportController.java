package com.smartbus.transport;

import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class TransportController {
    private final JdbcTemplate jdbc;
    public TransportController(JdbcTemplate jdbc){this.jdbc=jdbc;}
    @GetMapping("/universities")
    public List<Map<String,Object>> universities(){return jdbc.queryForList("SELECT id,name,code FROM universities WHERE active=true ORDER BY name");}
    @GetMapping("/universities/{id}/routes")
    public List<Map<String,Object>> routes(@PathVariable String id){return jdbc.queryForList("SELECT id,name FROM routes WHERE university_id=? AND active=true ORDER BY name",id);}
    @GetMapping("/routes/{id}/stops")
    public List<Map<String,Object>> stops(@PathVariable String id){return jdbc.queryForList("SELECT id,name,sequence_no,latitude,longitude,scheduled_time FROM stops WHERE route_id=? ORDER BY sequence_no",id);}
}
