package com.smartbus.integration;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "smartbus.external-tracking")
public record ExternalTrackingProperties(
        boolean enabled,
        String provider,
        String baseUrl,
        String apiToken,
        int pollSeconds
) {
    public ExternalTrackingProperties {
        provider = provider == null ? "none" : provider;
        baseUrl = baseUrl == null ? "" : baseUrl;
        apiToken = apiToken == null ? "" : apiToken;
        pollSeconds = pollSeconds < 10 ? 30 : pollSeconds;
    }
}
