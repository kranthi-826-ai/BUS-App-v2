package com.smartbus.alert;

import java.util.Map;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class EtaController {
    private final EtaService eta;
    public EtaController(EtaService eta){this.eta=eta;}
    @GetMapping("/trips/{tripId}/eta")
    public Map<String,Object> eta(@PathVariable String tripId,@RequestParam String stopId,@RequestParam(defaultValue="10") int leadMinutes){return eta.estimate(tripId,stopId,leadMinutes);}
}
