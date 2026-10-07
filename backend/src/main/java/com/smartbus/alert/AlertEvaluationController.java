package com.smartbus.alert;

import java.util.Map;
import java.util.UUID;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import com.smartbus.notification.ExpoPushService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/alerts")
public class AlertEvaluationController {
    private final EtaService eta; private final JdbcTemplate jdbc; private final ExpoPushService push;
    public AlertEvaluationController(EtaService eta, JdbcTemplate jdbc,ExpoPushService push){this.eta=eta;this.jdbc=jdbc;this.push=push;}
    @PostMapping("/evaluate")
    public Map<String,Object> evaluate(@RequestParam String studentId,@RequestParam String tripId,@RequestParam String stopId,@RequestParam int leadMinutes){
        Map<String,Object> estimate=eta.estimate(tripId,stopId,leadMinutes);
        if(!Boolean.TRUE.equals(estimate.get("alertEligible"))) return Map.of("created",false,"reason",estimate.get("stale") == Boolean.TRUE ? "STALE_LOCATION" : "NOT_YET_ELIGIBLE");
        String id=UUID.randomUUID().toString();
        try { jdbc.update("INSERT INTO notifications(id,student_id,stop_id,trip_id,type,status,sent_at) VALUES(?,?,?,?,?,?,CURRENT_TIMESTAMP(6))",id,studentId,stopId,tripId,"BUS_APPROACHING","PENDING"); }
        catch(DuplicateKeyException duplicate){ return Map.of("created",false,"reason","ALREADY_NOTIFIED"); }
        push.sendArrivalAlert(studentId,"Your bus is approximately "+estimate.get("etaMinutes")+" minutes away.");
        return Map.of("created",true,"notificationId",id,"estimate",estimate);
    }
}
