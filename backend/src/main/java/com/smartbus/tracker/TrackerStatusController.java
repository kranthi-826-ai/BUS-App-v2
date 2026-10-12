package com.smartbus.tracker;
import java.util.Map;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/v1/admin/tracker")
public class TrackerStatusController {
 private final TrackerClient tracker;
 public TrackerStatusController(TrackerClient tracker){this.tracker=tracker;}
 @GetMapping("/status") public Map<String,Object> status(){return Map.of("enabled",tracker.enabled(),"configured",System.getenv("TRACKER_API_URL")!=null&&System.getenv("TRACKER_API_TOKEN")!=null&&System.getenv("TRACKER_DEVICE_ID")!=null);}
}
