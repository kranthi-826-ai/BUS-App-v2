package com.smartbus.transport.dto;
import java.time.LocalDate;
public class DTOs {
    public static class BusDTO { public String id; public String collegeId; public String registrationNumber; public String displayName; public Integer capacity; public Boolean active; }
    public static class RouteDTO { public String id; public String collegeId; public String name; public String direction; public Boolean active; }
    public static class StopDTO { public String id; public String collegeId; public String name; public Double latitude; public Double longitude; public Boolean active; }
    public static class RouteStopDTO { public String id; public String routeId; public String stopId; public Integer sequenceNum; public Integer scheduledOffsetMins; }
    public static class BusRouteAssignmentDTO { public String id; public String busId; public String routeId; public LocalDate validFrom; public LocalDate validTo; }
    public static class InchargeAssignmentDTO { public String id; public String userId; public String busId; public LocalDate validFrom; public LocalDate validTo; }
    public static class StudentEnrolmentDTO { public String id; public String studentId; public String busId; public String selectedStopId; public String status; }
}
