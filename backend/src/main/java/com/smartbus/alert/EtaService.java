package com.smartbus.alert;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Map;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class EtaService {
    private final JdbcTemplate jdbc;
    public EtaService(JdbcTemplate jdbc){this.jdbc=jdbc;}
    public Map<String,Object> estimate(String tripId,String stopId,int leadMinutes){
        List<Map<String,Object>> locations=jdbc.queryForList("SELECT latitude,longitude,captured_at,speed FROM locations WHERE trip_id=? AND accepted=true ORDER BY captured_at DESC LIMIT 1",tripId);
        if(locations.isEmpty()) return Map.of("tripId",tripId,"stopId",stopId,"stale",true,"etaSeconds",-1);
        List<Map<String,Object>> stops=jdbc.queryForList("SELECT latitude,longitude FROM stops WHERE id=?",stopId);
        if(stops.isEmpty()) throw new IllegalArgumentException("Stop was not found");
        Map<String,Object> current=locations.get(0); Map<String,Object> stop=stops.get(0);
        Instant captured=((java.sql.Timestamp)current.get("captured_at")).toInstant();
        boolean stale=captured.isBefore(Instant.now().minusSeconds(60));
        double distance=distance(((Number)current.get("latitude")).doubleValue(),((Number)current.get("longitude")).doubleValue(),((Number)stop.get("latitude")).doubleValue(),((Number)stop.get("longitude")).doubleValue());
        double speed=current.get("speed")==null?4.0:Math.max(4.0,((Number)current.get("speed")).doubleValue());
        long eta=Math.round(distance/speed);
        return Map.of("tripId",tripId,"stopId",stopId,"distanceMeters",Math.round(distance),"etaSeconds",eta,"leadMinutes",leadMinutes,"stale",stale,"alertEligible",!stale && eta<=leadMinutes*60L);
    }
    private double distance(double a,double b,double c,double d){double r=6371000, p=Math.toRadians(c-a),q=Math.toRadians(d-b);double x=Math.sin(p/2)*Math.sin(p/2)+Math.cos(Math.toRadians(a))*Math.cos(Math.toRadians(c))*Math.sin(q/2)*Math.sin(q/2);return 2*r*Math.atan2(Math.sqrt(x),Math.sqrt(1-x));}
}
