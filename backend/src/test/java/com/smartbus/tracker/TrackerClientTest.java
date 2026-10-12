package com.smartbus.tracker;
import static org.junit.jupiter.api.Assertions.*;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
class TrackerClientTest {
 @Test void defaultsToDisabled(){TrackerClient client=new TrackerClient(new ObjectMapper());assertFalse(client.enabled());assertThrows(IllegalStateException.class,client::fetch);}
}
