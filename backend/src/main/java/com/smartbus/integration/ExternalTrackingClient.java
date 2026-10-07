package com.smartbus.integration;

import java.time.Duration;
import java.time.Instant;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

@Service
public class ExternalTrackingClient {
    private final ExternalTrackingProperties properties;
    private final RestClient restClient;

    public ExternalTrackingClient(ExternalTrackingProperties properties, RestClient.Builder builder) {
        this.properties = properties;
        this.restClient = builder.baseUrl(properties.baseUrl()).build();
    }

    public ExternalLocation fetch(String busId) {
        if (!properties.enabled() || properties.baseUrl().isBlank()) {
            throw new IllegalStateException("External tracking is not configured");
        }
        ExternalLocation location = restClient.get()
                .uri(uriBuilder -> uriBuilder.path("/buses/{busId}/location").build(busId))
                .headers(headers -> {
                    headers.setAccept(java.util.List.of(MediaType.APPLICATION_JSON));
                    if (!properties.apiToken().isBlank()) {
                        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + properties.apiToken());
                    }
                })
                .retrieve()
                .body(ExternalLocation.class);
        validate(location, busId);
        return location;
    }

    private void validate(ExternalLocation location, String requestedBusId) {
        if (location == null || location.capturedTime() == null || !requestedBusId.equals(location.busId())) {
            throw new IllegalStateException("Provider returned an invalid bus location");
        }
        if (location.latitude() < -90 || location.latitude() > 90
                || location.longitude() < -180 || location.longitude() > 180) {
            throw new IllegalStateException("Provider returned invalid coordinates");
        }
        if (location.capturedTime().isAfter(Instant.now().plus(Duration.ofMinutes(2)))) {
            throw new IllegalStateException("Provider returned a future timestamp");
        }
        if (location.capturedTime().isBefore(Instant.now().minus(Duration.ofMinutes(10)))) {
            throw new IllegalStateException("Provider location is stale");
        }
    }
}
