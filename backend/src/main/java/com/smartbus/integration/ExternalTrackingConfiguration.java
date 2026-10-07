package com.smartbus.integration;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@EnableConfigurationProperties(ExternalTrackingProperties.class)
public class ExternalTrackingConfiguration {
}
