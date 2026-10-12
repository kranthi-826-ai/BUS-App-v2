package com.smartbus.tracker;
import com.fasterxml.jackson.databind.*;
import java.net.URI; import java.net.http.*; import java.time.Instant;
import org.springframework.stereotype.Service;
@Service public class TrackerClient {
 public record Position(String deviceId,double latitude,double longitude,Instant timestamp,Double speed,Double heading){}
 private final HttpClient client=HttpClient.newHttpClient(); private final ObjectMapper json;
 public TrackerClient(ObjectMapper json){this.json=json;}
 public boolean enabled(){return Boolean.parseBoolean(System.getenv().getOrDefault("TRACKER_ENABLED","false"));}
 public Position fetch() throws Exception {
  if(!enabled()) throw new IllegalStateException("Tracker integration is disabled");
  String url=required("TRACKER_API_URL"),token=required("TRACKER_API_TOKEN"),device=required("TRACKER_DEVICE_ID");
  HttpResponse<String> response=client.send(HttpRequest.newBuilder(URI.create(url)).header("Authorization","Bearer "+token).header("Accept","application/json").GET().build(),HttpResponse.BodyHandlers.ofString());
  if(response.statusCode()/100!=2) throw new IllegalStateException("Tracker returned HTTP "+response.statusCode());
  JsonNode root=json.readTree(response.body());
  return new Position(device,requiredNumber(root,"latitude"),requiredNumber(root,"longitude"),Instant.parse(requiredText(root,"timestamp")),optionalNumber(root,"speed"),optionalNumber(root,"heading"));
 }
 private static String required(String name){String value=System.getenv(name);if(value==null||value.isBlank())throw new IllegalStateException(name+" is required when TRACKER_ENABLED=true");return value;}
 private static String requiredText(JsonNode root,String key){JsonNode value=root.get(key);if(value==null||value.asText().isBlank())throw new IllegalArgumentException("Tracker response missing "+key);return value.asText();}
 private static double requiredNumber(JsonNode root,String key){JsonNode value=root.get(key);if(value==null||!value.isNumber())throw new IllegalArgumentException("Tracker response missing "+key);return value.asDouble();}
 private static Double optionalNumber(JsonNode root,String key){JsonNode value=root.get(key);return value!=null&&value.isNumber()?value.asDouble():null;}
}
