package com.smartbus.alert;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

record SubscriptionRequest(@NotBlank String studentId,@NotBlank String stopId,@Min(1) int leadMinutes) {}

@RestController
@RequestMapping("/api/v1")
public class SubscriptionController {
    private final JdbcTemplate jdbc;
    public SubscriptionController(JdbcTemplate jdbc){this.jdbc=jdbc;}
    @PutMapping("/subscription")
    public Map<String,Object> subscribe(@RequestBody SubscriptionRequest request){
        jdbc.update("DELETE FROM subscriptions WHERE student_id=?",request.studentId());
        String id=UUID.randomUUID().toString();
        jdbc.update("INSERT INTO subscriptions(id,student_id,stop_id,lead_minutes,active) VALUES(?,?,?,?,true)",id,request.studentId(),request.stopId(),request.leadMinutes());
        return Map.of("id",id,"studentId",request.studentId(),"stopId",request.stopId(),"leadMinutes",request.leadMinutes(),"active",true);
    }
    @GetMapping("/subscription")
    public List<Map<String,Object>> subscription(@RequestParam String studentId){return jdbc.queryForList("SELECT id,student_id,stop_id,lead_minutes,active FROM subscriptions WHERE student_id=? AND active=true",studentId);}
    @GetMapping("/notifications")
    public List<Map<String,Object>> notifications(@RequestParam String studentId){return jdbc.queryForList("SELECT id,stop_id,trip_id,type,status,sent_at,read_at FROM notifications WHERE student_id=? ORDER BY sent_at DESC",studentId);}
    @PostMapping("/notifications/{id}/read")
    public Map<String,Object> read(@PathVariable String id){jdbc.update("UPDATE notifications SET read_at=COALESCE(read_at, CURRENT_TIMESTAMP(6)) WHERE id=?",id);return Map.of("id",id,"read",true);}
}
