package com.smartbus.trip;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

record StartTripRequest(@NotBlank String busId, @NotBlank String routeId, @NotBlank String startedBy) {}
record LocationRequest(@NotNull Double latitude, @NotNull Double longitude, @NotNull Instant capturedAt, Double speed, Double heading, Double accuracy) {}
record LocationBatchRequest(@NotBlank String deviceId, @NotNull List<@Valid LocationRequest> points) {}

@RestController
@RequestMapping("/api/v1/trips")
public class TripController {
    private final JdbcTemplate jdbc;
    private final LocationValidationService validator;
    public TripController(JdbcTemplate jdbc, LocationValidationService validator){this.jdbc=jdbc;this.validator=validator;}

    @PostMapping("/start")
    public Map<String,Object> start(@Valid @RequestBody StartTripRequest request){
        String id=UUID.randomUUID().toString();
        jdbc.update("INSERT INTO trips(id,bus_id,route_id,started_by,status,started_at) VALUES(?,?,?,?,?,?)",id,request.busId(),request.routeId(),request.startedBy(),"STARTED",Instant.now());
        return Map.of("id",id,"busId",request.busId(),"routeId",request.routeId(),"status","STARTED");
    }

    @PostMapping("/{tripId}/locations/batch")
    public Map<String,Object> locations(@PathVariable String tripId,@Valid @RequestBody LocationBatchRequest request){
        LocationPoint previous=null; int accepted=0; int rejected=0;
        for(LocationRequest item:request.points()){
            LocationPoint point=new LocationPoint(item.latitude(),item.longitude(),item.capturedAt(),item.speed(),item.heading(),item.accuracy());
            String reason=null;
            try{validator.validate(point,previous,Instant.now()); previous=point; accepted++;}
            catch(IllegalArgumentException error){reason=error.getMessage(); rejected++;}
            jdbc.update("INSERT INTO locations(trip_id,latitude,longitude,captured_at,received_at,speed,heading,accuracy,accepted,reject_reason) VALUES(?,?,?,?,?,?,?,?,?,?)",tripId,point.latitude(),point.longitude(),point.capturedAt(),Instant.now(),point.speed(),point.heading(),point.accuracy(),reason==null,reason);
        }
        return Map.of("tripId",tripId,"accepted",accepted,"rejected",rejected);
    }

    @PostMapping("/{tripId}/end")
    public Map<String,Object> end(@PathVariable String tripId){jdbc.update("UPDATE trips SET status='ENDED',ended_at=? WHERE id=?",Instant.now(),tripId);return Map.of("tripId",tripId,"status","ENDED");}

    @GetMapping("/{tripId}/locations/latest")
    public Map<String,Object> latest(@PathVariable String tripId){
        List<Map<String,Object>> rows=jdbc.queryForList("SELECT latitude,longitude,captured_at,received_at,speed,heading,accuracy FROM locations WHERE trip_id=? AND accepted=true ORDER BY captured_at DESC LIMIT 1",tripId);
        if(rows.isEmpty()) return Map.of("tripId",tripId,"stale",true);
        Map<String,Object> row=rows.get(0); Instant captured=((java.sql.Timestamp)row.get("captured_at")).toInstant();
        return Map.of("tripId",tripId,"latitude",row.get("latitude"),"longitude",row.get("longitude"),"capturedAt",captured,"speed",row.get("speed"),"heading",row.get("heading"),"accuracy",row.get("accuracy"),"stale",captured.isBefore(Instant.now().minusSeconds(60)));
    }

    @GetMapping("/route/{routeId}/active")
    public Map<String,Object> activeForRoute(@PathVariable String routeId){
        List<Map<String,Object>> rows=jdbc.queryForList("SELECT id,bus_id,started_at FROM trips WHERE route_id=? AND status='STARTED' ORDER BY started_at DESC LIMIT 1",routeId);
        return rows.isEmpty()?Map.of("active",false):Map.of("active",true,"tripId",rows.get(0).get("id"),"busId",rows.get(0).get("bus_id"),"startedAt",rows.get(0).get("started_at"));
    }
}
