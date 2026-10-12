package com.smartbus.transport;
import static org.junit.jupiter.api.Assertions.*; import java.util.List; import org.junit.jupiter.api.Test;
class Route8StopImporterTest {
 @Test void rejectsUnverifiedData(){assertThrows(IllegalArgumentException.class,()->Route8StopImporter.validate(new Route8StopImporter.Seed("DRAFT","route",List.of(new Route8StopImporter.Stop("Stop",17.4,78.4,1)))));}
 @Test void acceptsVerifiedValidData(){assertDoesNotThrow(()->Route8StopImporter.validate(new Route8StopImporter.Seed("VERIFIED_BY_COLLEGE","route",List.of(new Route8StopImporter.Stop("Stop",17.4,78.4,1)))));}
 @Test void rejectsDuplicateSequence(){assertThrows(IllegalArgumentException.class,()->Route8StopImporter.validate(new Route8StopImporter.Seed("VERIFIED_BY_COLLEGE","route",List.of(new Route8StopImporter.Stop("A",17.4,78.4,1),new Route8StopImporter.Stop("B",17.5,78.5,1)))));}
}
