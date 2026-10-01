# Architecture

## System context

```text
Student Android app ─┐                         ┌─ MySQL 8.4 LTS
                     ├─ HTTPS/WebSocket ─ Spring Boot API
In-charge Android app┘                         ├─ Expo Push Service / FCM
                                              └─ Flask AI adapter (future, disabled)
```

The IDEs do not connect to each other. A running mobile app calls the backend over the network; only the backend accesses MySQL. The future AI service is also called only by the backend.

## Repository modules

```text
mobile/src/
  app/             navigation and composition
  features/        auth, enrolment, trip, tracking, alert, attendance
  components/      reusable presentation components
  api/             generated/manual typed client, auth refresh, errors
  storage/         SecureStore and bounded offline queue
  background/      TaskManager location publisher
  config/          validated public configuration

backend/src/main/java/com/smartbus/
  auth/            login, token rotation/revocation, authorization
  transport/       college, bus, route, stop, assignment, enrolment
  trip/            trip lifecycle and location ingestion/query
  alert/           subscriptions, proximity state, push outbox
  attendance/      phase 2/3 boundary
  common/          errors, audit, time, configuration, observability

backend/src/main/resources/db/migration/   Flyway migrations
contracts/openapi.yaml                     versioned HTTP contract
```

Prefer a modular monolith. It is simpler to deploy and test than microservices while preserving clear feature boundaries.

## Runtime flows

### Trip and tracking

1. In-charge starts a trip; backend verifies role and assignment.
2. Android development/release build starts an explicit foreground location service.
3. Client sends sequenced points containing trip ID, captured time, coordinates, accuracy, speed, and heading.
4. Backend rejects implausible, stale, future, unauthorized, or duplicate points; stores accepted points and updates a latest-location projection.
5. Student receives WebSocket updates when connected and falls back to `GET latest` polling with backoff.
6. UI always shows last-updated age and never displays stale data as live.

### Arrival alert

1. Student subscribes to one bus/stop and radius.
2. On accepted bus locations, backend computes Haversine distance to subscribed stops.
3. State machine: `OUTSIDE -> APPROACHING -> NOTIFIED`; use hysteresis (re-arm only beyond radius + 200 m) and one notification per trip.
4. A transactional outbox stores notification work in the same DB transaction as state changes.
5. Worker sends through Expo Push/FCM, records receipt/failure, and retries transient failures with a cap.

### Offline behaviour

- In-charge queue is bounded by point count/age and uses a monotonic sequence. Prefer the newest representative points; never upload an unlimited trace.
- Student uses cached bus/route/stop data labelled offline, but cached coordinates are never labelled live.
- Server write endpoints accept idempotency keys where user/device retries are expected.

## Security boundaries

- TLS outside local development.
- JWT access token in memory; refresh token in SecureStore and rotated on use.
- Backend validates every resource against role, college, assignment, and active trip.
- Bus codes are high-entropy, expire, are rate-limited, stored hashed, and never returned after creation.
- Student devices do not send continuous location.

## Deployment profiles

- **Local dev:** mobile physical device + laptop API + local MySQL; use laptop LAN IP, not `localhost` from the phone.
- **College pilot:** Ubuntu/college VM, containerized backend/MySQL, HTTPS reverse proxy, daily encrypted backup, outbound internet for push/map tiles.
- **Demo fallback:** if internet push fails, keep both apps foreground on the same network; clearly label this as degraded mode, not a passed background-alert test.

## Important platform constraint

Expo Go is insufficient. Background location, push notifications, and MapLibre require a custom development build/release APK. Android may stop background work after a force-stop, and vendor battery optimizers vary; the UI/runbook must explain this and tests must include the target phones.
