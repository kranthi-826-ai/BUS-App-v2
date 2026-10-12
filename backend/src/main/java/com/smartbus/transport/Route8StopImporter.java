package com.smartbus.transport;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.nio.file.*; import java.util.*;
import org.springframework.boot.*; import org.springframework.jdbc.core.JdbcTemplate; import org.springframework.stereotype.Component;
@Component public class Route8StopImporter implements ApplicationRunner {
 record Stop(String name,double latitude,double longitude,int sequence){}
 record Seed(String status,String routeId,List<Stop> stops){}
 private final ObjectMapper json; private final JdbcTemplate jdbc;
 Route8StopImporter(ObjectMapper json,JdbcTemplate jdbc){this.json=json;this.jdbc=jdbc;}
 public void run(ApplicationArguments args)throws Exception{if(!Boolean.parseBoolean(System.getenv().getOrDefault("ROUTE8_IMPORT_ENABLED","false")))return;Path file=Path.of(System.getenv().getOrDefault("ROUTE8_IMPORT_FILE","seed/stops.route8.json"));if(!Files.isRegularFile(file))throw new IllegalStateException("Route 8 seed file is missing: "+file);Seed seed=json.readValue(file.toFile(),Seed.class);validate(seed);for(Stop stop:seed.stops())jdbc.update("INSERT INTO stops(id,route_id,name,latitude,longitude,stop_order) VALUES(?,?,?,?,?,?) ON DUPLICATE KEY UPDATE name=VALUES(name),latitude=VALUES(latitude),longitude=VALUES(longitude)",UUID.nameUUIDFromBytes((seed.routeId()+":"+stop.sequence()).getBytes()).toString(),seed.routeId(),stop.name().trim(),stop.latitude(),stop.longitude(),stop.sequence());}
 static void validate(Seed seed){if(!"VERIFIED_BY_COLLEGE".equals(seed.status()))throw new IllegalArgumentException("Route 8 data must be marked VERIFIED_BY_COLLEGE");if(seed.routeId()==null||seed.routeId().isBlank())throw new IllegalArgumentException("routeId is required");if(seed.stops()==null||seed.stops().isEmpty())throw new IllegalArgumentException("At least one verified stop is required");var sequences=new HashSet<Integer>();for(Stop stop:seed.stops()){if(stop.name()==null||stop.name().isBlank())throw new IllegalArgumentException("Stop name is required");if(stop.latitude() < -90||stop.latitude()>90||stop.longitude() < -180||stop.longitude()>180)throw new IllegalArgumentException("Invalid stop coordinates");if(stop.sequence()<1||!sequences.add(stop.sequence()))throw new IllegalArgumentException("Stop sequence must be unique and positive");}}
}
