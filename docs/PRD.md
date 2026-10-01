# Product Requirements Document

## 1. Product

**Name:** Smart College Bus  
**Release:** Android college pilot MVP  
**Problem:** Students do not know where their college bus is or when it will reach their stop; transport staff lack a trustworthy live trip view. The old prototype used hardcoded data and simulated tracking.

## 2. Goal and measurable success

Deliver a real two-phone demonstration and a pilot-ready Android APK:

- In-charge starts a trip and publishes real GPS in the background with a visible Android foreground-service notification.
- A student enrolled in that bus sees location updates no older than 45 seconds under normal connectivity.
- The student receives one approach alert when the bus enters the configured radius (default 500 m).
- Bus verification, routes, stops, trips, and users come from the backend/database, not hardcoded app logic.
- Core flow survives temporary network loss without corrupting trip or alert state.
- No critical/high security finding, no plain-text password, and no committed secret.

Target pilot: one college, Android only, 1-5 buses, up to 200 students, and up to 50 concurrent live viewers per bus. These are planning defaults until the college confirms actual numbers.

## 3. Personas and roles

- **Student:** joins an approved bus, selects a boarding stop, tracks it, and receives alerts.
- **Bus in-charge:** staff member assigned to one or more buses; operates the driver-mode phone. Driver and in-charge are one MVP role.
- **Transport admin:** manages colleges, buses, routes, stops, assignments, and accounts through protected backend APIs and seed/import tools. A web admin UI is not in MVP.

## 4. MVP user journeys

### Student

1. Sign in with a college-approved account.
2. Select college (single preselected college in pilot), bus, and boarding stop.
3. Enter a bus enrolment code; backend validates a hashed, active, unexpired code.
4. Set alert radius from allowed values: 300, 500, 750, or 1000 m.
5. View bus marker, route/stops, last-updated time, trip state, and stale/offline status.
6. Receive at most one arrival alert per trip/stop/radius crossing; re-arm only after the bus exits the hysteresis radius or a new trip begins.

### Bus in-charge

1. Sign in and see assigned bus.
2. Start a trip for that bus and route; duplicate active trips are rejected.
3. Grant foreground/background location permission with clear purpose text.
4. Publish GPS while trip is active. Queue bounded updates during brief outages and upload newest useful points after reconnection.
5. See GPS/network/last-upload health and end the trip.

### Admin/API operator

1. Import or seed college, routes, ordered stops, buses, assignments, and approved users.
2. Issue/revoke bus enrolment codes.
3. View active trips and export trip/location audit data subject to role and retention rules.

## 5. Functional requirements

| ID | Requirement | Acceptance summary |
|---|---|---|
| AUTH-01 | Secure login and refresh | Argon2id/BCrypt hash; short access token; rotated/revocable refresh token |
| AUTH-02 | Role authorization | Student cannot start trips; in-charge cannot administer data |
| BUS-01 | Backend bus enrolment | Invalid/expired/revoked/wrong-bus code returns stable error code |
| TRIP-01 | Trip lifecycle | One active trip per bus; start/end are audited and idempotent |
| LOC-01 | Real GPS publishing | Authenticated assigned in-charge only; accuracy and timestamp validated |
| LOC-02 | Live student view | Latest point and stream/poll fallback; visibly stale after 45 seconds |
| ALERT-01 | Approach alert | Server evaluates bus-to-stop distance and sends one push per approach event |
| ALERT-02 | Safe fallback | If push registration fails, foreground in-app alert still works and UI explains limitation |
| OFF-01 | Network recovery | Exponential backoff, bounded queue, no duplicate/corrupt writes |
| OBS-01 | Operability | Health endpoint, structured logs, request correlation ID, basic metrics |

## 6. Attendance scope

Tracking/alerts are the MVP dependency. Attendance data contracts and screens may be scaffolded only after the tracking gate passes.

- Phase 2 can add audited manual attendance and CSV reports as a non-biometric fallback.
- Phase 3 can integrate the existing Flask/DeepFace service behind `FEATURE_FACE_ATTENDANCE`.
- Future AI returns a candidate student and confidence; Spring Boot alone authorizes and writes attendance.
- Low confidence, duplicate scans, wrong bus/trip, and inactive students must never auto-mark present.
- No accuracy percentage may be claimed without a documented representative evaluation.

## 7. Non-functional requirements

- Android 10+ pilot target; verify actual minimum supported by the selected Expo SDK.
- API p95 below 500 ms on college LAN excluding external push delivery.
- Location ingest supports 1 update/5 seconds/in-charge during pilot; server may down-sample retained history.
- Battery target: less than 10% additional drain per hour during active tracking on test devices; measure, do not assume.
- Accessibility: labelled controls, 44dp touch targets, scalable text, color-independent state indicators.
- English first; UI strings centralized for later Telugu/Hindi/local-language support.
- Backup and restore must be demonstrated before pilot.

## 8. Out of scope for MVP

- iOS, public transit routing, payments, SMS OTP, public app-store launch, a website wrapper, turn-by-turn navigation, continuous student location tracking, and production face recognition.

## 9. Safe defaults pending college confirmation

- Single college; Android; internet available on both phones; CSV reports later; bus in-charge and driver are one role.
- College supplies approved user list, stop coordinates, route order, bus assignments, retention approval, privacy notice, and two physical Android test phones.

## 10. Release gate

The MVP is accepted only after the two-phone route test, permission-denial test, background test, network-loss/recovery test, stale-location test, duplicate-alert test, authorization tests, backup/restore drill, and APK installation all pass with recorded evidence.
