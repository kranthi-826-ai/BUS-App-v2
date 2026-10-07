# Build progress

## Master checklist

- [x] Phase 1: foundation, Flyway, MySQL compose, mobile shell
- [x] Phase 2: password hashing, JWT issue, roles, dev seed
- [x] Phase 3: university/route/stop catalog and GPS validation
- [x] Phase 4: trip start/end, batch locations, latest location
- [x] Phase 5: distance/ETA and stale eligibility
- [x] Phase 6: subscriptions, notification history, duplicate alert guard
- [x] Phase 7a: polished student/driver demo shell
- [x] Phase 7b: authenticated mobile API client foundation
- [ ] Phase 7c: background GPS, offline queue, push delivery
- [ ] Phase 8: admin, deployment, APK, physical two-phone Definition of Done
- [x] Add an admin-only operational dashboard API.

### Phase 7b current work

- [x] Mobile login calls `/api/v1/auth/login`.
- [x] Mobile displays backend/network errors without crashing.
- [x] Local dependency install and TypeScript validation repaired.
- [x] Persist access token securely and add university/route/stop client helpers.
- [x] Add foreground driver GPS publishing helper with permission and bearer token handling.
- [x] Add authenticated latest-location and alarm-subscription client methods.
- [x] Add authenticated notification polling for unread alerts.
- [x] Persist pending driver locations locally and retry them in ordered batches.
- [x] Add physical-device Expo push registration and local arrival-alarm helpers.
- [x] Add minimized-app driver GPS task with Android foreground-service configuration.
- [x] Persist Expo device tokens and submit push messages after a newly eligible alert.
- [x] Add production-style backend Docker image and API/MySQL compose stack.
- [ ] Verify Docker image with a running local Docker engine.
- [x] Add GitHub Actions gates for backend tests and mobile strict type checking.

## Foundation

- Started clean rebuild from the supplied master prompt.
- Added Java 21/Spring Boot backend skeleton, MySQL/Flyway foundation, and health endpoint.
- Remaining gate: local database migration and mobile shell validation.

## Phase 2

- Added BCrypt/JWT login and dev roles/seed.
- Verified backend compilation and pushed commit `eee3f72`.

## Phase 3 started

- Added buses, trips, validated location storage, subscriptions, and notification uniqueness schema.

## Phase 3 location validation

- Added strict coordinate, freshness, accuracy, speed, future-time, and ordering validation.
- Added automated rejection tests.
- Added an explicitly empty Route 8 seed placeholder; verified college stop data is still required.

## Phase 3 transport read APIs

- Added university, route, and stop read endpoints.
- Added clearly labelled demo university/Route 8 seed metadata without invented stop coordinates.

## Phase 4 trip/location API

- Added trip start/end endpoints.
- Added ordered batch location ingestion with accepted/rejected counts.
- Added latest-location retrieval with stale-state calculation.

## Phase 5 ETA foundation

- Added Haversine distance and ETA calculation.
- Added minimum-speed handling so stopped buses never produce infinite ETA.
- Added stale-location guard; stale data is never alert eligible.

## Phase 6 subscriptions

- Added student stop/lead-time subscription endpoint.
- Added notification history and read-state endpoints.

## Phase 6 alert evaluator

- Added ETA-gated alert evaluation.
- Added unique notification insertion for one-alert-per-student/stop/trip behavior.
- Stale locations are never alert eligible.
