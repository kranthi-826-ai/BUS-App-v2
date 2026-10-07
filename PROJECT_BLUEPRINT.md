# Smart College Bus Alarm

## 1. Project idea

Smart College Bus Alarm is an Android application that warns students before their college bus reaches their selected boarding stop. The prototype will use GPS coordinates from two mobile phones: one phone simulates the bus/in-charge device and the second phone is the student device.

The production version will replace the bus phone with the college's authorized GPS provider API.

## 2. Problem statement

Students miss college buses because they do not know the bus's current position or arrival time. Students either reach the stop too late or wait unnecessarily for a bus that is delayed. Existing public tracking links may show a vehicle, but they do not automatically provide a reliable, personalized alarm for each student's stop.

## 3. Proposed solution

The system lets a student:

1. Select a language.
2. Log in with college credentials.
3. Select the university and bus route.
4. Select a boarding stop.
5. Choose an alert lead time such as 5, 10, or 15 minutes.
6. See the active bus on a map.
7. Receive an in-app and push notification before the bus reaches the stop.

The backend receives GPS updates, validates them, calculates ETA, and sends one alert per student, stop, and trip.

## 4. Prototype demo

### Phone A: bus/in-charge simulator

- Logs in as an in-charge.
- Starts Route 8 demo trip.
- Publishes its GPS latitude and longitude.
- Sends timestamp, speed, and heading when available.
- Can pause, resume, and end the trip.

### Phone B: student

- Logs in as a student.
- Selects Route 8 and a boarding stop.
- Sets an alert, for example 10 minutes before arrival.
- Watches the bus move on the map.
- Receives the arrival alert.

Both phones use the same hosted or laptop-accessible backend. The student app never connects directly to the database.

## 5. Location data contract

The prototype phone publisher and future college tracker API use the same normalized object:

```json
{
  "busId": "route8-bus1",
  "latitude": 17.4475,
  "longitude": 78.4377,
  "capturedAt": "2026-10-07T10:20:00Z",
  "speed": 24.5,
  "heading": 180,
  "accuracy": 8.0
}
```

For production provider integration, an administrator configures the API URL, encrypted API token, bus/device ID, and polling interval. Students never see these credentials.

## 6. Accurate alarm rules

An alert is sent only when:

- The student has an active subscription.
- The bus belongs to the student's selected route/bus.
- The location is valid and fresh.
- The bus is approaching the selected stop.
- ETA is less than or equal to the student's lead time.
- The alert has not already been sent for this trip and stop.

The system must reject invalid coordinates, future timestamps, stale locations, duplicate points, and mismatched bus IDs. If the location is stale, the UI must say so instead of displaying a false live status.

## 7. System architecture

```text
Bus phone GPS or college GPS API
            ↓
Spring Boot REST backend
            ↓
MySQL + Flyway + validation
            ↓
ETA/geofence/alert engine
            ↓
Expo push notifications and in-app status
            ↓
Student Android application
```

Components:

- Mobile: React Native, Expo, TypeScript strict mode.
- Backend: Java 21, Spring Boot, Spring Security, JWT, JPA, Flyway.
- Database: MySQL.
- Maps: React Native Maps with a configured Android Google Maps key, or a documented free map provider.
- Source control: GitHub.
- Testing: JUnit/Spring integration tests, TypeScript checks, Postman, and two physical Android phones.

## 8. Required application roles

### Student

- Login/signup
- University and route selection
- Bus and stop selection
- Alert lead-time selection
- Live tracking
- Stale/offline status
- Notification history
- Profile and logout

### In-charge

- Secure login
- Assigned bus and route
- Start/pause/resume/end trip
- Location publishing
- Connection and GPS status

### Admin/transport office

- Manage universities, buses, routes, stops, assignments, and students.
- Configure authorized external tracking API.
- Test provider connection.
- View last successful update and stale status.
- Review trips and alert failures.

## 9. October prototype deadline

### Week 1: specification and data

- Freeze the PRD and API contract.
- Verify Route 8 stop names and coordinates with the college.
- Finalize demo accounts and two-phone flow.

### Week 2: backend and database

- Complete authentication, routes, stops, buses, trips, and location ingestion.
- Add provider configuration boundary.
- Run migration and integration tests.

### Week 3: mobile experience

- Finish language, login, route, bus, stop, alarm, dashboard, and in-charge screens.
- Fix map configuration and gesture handling.
- Add loading, empty, stale, offline, and error states.

### Week 4: alert engine and demo

- Test ETA and one-alert behavior.
- Run the two-phone physical demo.
- Build a downloadable Android APK.
- Prepare README, screenshots, architecture diagram, and resume/project explanation.

## 10. Definition of done for the prototype

- A student can complete the flow without developer intervention.
- An in-charge phone can start a demo trip and publish GPS.
- A student phone can see the bus location.
- The student receives the configured arrival alert.
- Duplicate and stale alerts are prevented.
- Backend tests and mobile type checking pass.
- No secrets are committed to GitHub.
- The APK can be installed on an Android phone.
- The demonstration uses real phone GPS, not fake hardcoded movement.

## 11. Important Route 8 limitation

The supplied Fleetx public share link is not treated as a documented live API. It may be used for investigation or an external-link fallback, but production coordinates must come from an authorized provider API or the two-phone GPS prototype. A stale public coordinate must never be shown as current bus location.

## 12. Agent responsibility

The coding agent is responsible for:

- Backend implementation and validation.
- Mobile implementation and validation.
- Database migrations.
- API contracts and tests.
- Error handling and security.
- Build instructions and release APK preparation.
- GitHub commits and documentation.

The student only needs to provide authorized college data/API credentials when required and test the final APK on the phone.
