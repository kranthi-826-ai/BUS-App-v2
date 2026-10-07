package com.smartbus.notification;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
@Service
public class ExpoPushService {
 private final JdbcTemplate jdbc; private final HttpClient client=HttpClient.newHttpClient();
 public ExpoPushService(JdbcTemplate jdbc){this.jdbc=jdbc;}
 public void sendArrivalAlert(String userId,String body){
  List<String> tokens=jdbc.queryForList("SELECT expo_push_token FROM device_push_tokens WHERE user_id=?",String.class,userId);
  for(String token:tokens) try {
   String json="{\"to\":\""+escape(token)+"\",\"title\":\"Bus approaching\",\"body\":\""+escape(body)+"\",\"sound\":\"default\"}";
   client.sendAsync(HttpRequest.newBuilder(URI.create("https://exp.host/--/api/v2/push/send")).header("Content-Type","application/json").POST(HttpRequest.BodyPublishers.ofString(json)).build(),HttpResponse.BodyHandlers.discarding());
  } catch(Exception ignored) {}
 }
 private String escape(String value){return value.replace("\\","\\\\").replace("\"","\\\"");}
}
