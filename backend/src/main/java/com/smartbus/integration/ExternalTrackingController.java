package com.smartbus.integration;

import java.util.Map;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/integrations/tracking")
public class ExternalTrackingController {
    private final ExternalTrackingProperties properties;
    private final ExternalTrackingClient client;

    public ExternalTrackingController(ExternalTrackingProperties properties, ExternalTrackingClient client) {
        this.properties = properties;
        this.client = client;
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public Map<String, Object> status() {
        return Map.of(
                "enabled", properties.enabled(),
                "provider", properties.provider(),
                "configured", properties.enabled() && !properties.baseUrl().isBlank(),
                "pollSeconds", properties.pollSeconds(),
                "message", properties.enabled() && !properties.baseUrl().isBlank()
                        ? "External tracking adapter configured; provider response validation is required."
                        : "External tracking is not configured. Authenticated in-charge GPS remains the fallback."
        );
    }

    @GetMapping("/buses/{busId}/location")
    @PreAuthorize("hasAnyRole('STAFF', 'ADMIN')")
    public ExternalLocation location(@org.springframework.web.bind.annotation.PathVariable String busId) {
        return client.fetch(busId);
    }
}
