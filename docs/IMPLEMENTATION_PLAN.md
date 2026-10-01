# Implementation Plan

Agents must complete one milestone and its gate before starting the next. Checkboxes are evidence, not aspiration.

## M0 - Recover a clean repository

- [ ] Back up any useful external prototype separately.
- [ ] Remove/replace corrupted `.git` and `node_modules` only with explicit user approval.
- [ ] Initialize Git, `.gitignore`, formatting, secret scanning, and baseline CI.
- **Gate:** clean `git status`; no tracked dependencies/secrets; CI can execute placeholder checks.

## M1 - Contracts and runnable skeletons

- [ ] Create `mobile/` with Expo SDK 57 TypeScript strict development-build workflow.
- [ ] Create `backend/` with Java 21, Spring Boot 4.1.x, Maven Wrapper.
- [ ] Create OpenAPI, Flyway baseline, profiles, health endpoint, and local compose/native-MySQL instructions.
- **Gate:** mobile typecheck/lint/test; backend `./mvnw verify`; database migration from empty succeeds.

## M2 - Authentication and authorization

- [ ] Approved account seed/import, secure login/refresh/logout, SecureStore, roles, audit events, rate limits.
- **Gate:** positive/negative integration tests including refresh reuse, disabled user, cross-role access, and no secret leakage.

## M3 - Transport configuration and enrolment

- [ ] College, buses, routes, ordered stops, assignments, hashed expiring bus codes, student stop selection.
- **Gate:** no hardcoded business data in mobile; invalid/expired/wrong-bus code tests; seed data produces a usable pilot route.

## M4 - Real trip/location pipeline

- [ ] Trip lifecycle, background foreground-service publisher, bounded offline queue, batch ingest, latest location, stale state, map marker/route/stops.
- **Gate:** physical in-charge phone continues publishing in background; student phone tracks it; authorization, duplicate, stale, invalid, and reconnect tests pass.

## M5 - Arrival alerts

- [ ] Subscription UI, Haversine/hysteresis state machine, outbox, Expo Push/FCM, receipts/retry, in-app fallback.
- **Gate:** exactly one alert on approach, no alert outside radius, re-arm/new-trip behaviour, background notification on physical device, failure visibly degrades.

## M6 - Pilot hardening

- [ ] Accessibility, battery/data measurement, structured logs/metrics, backups, restore, HTTPS deployment, release APK, operator and privacy material.
- **Gate:** full release checklist in PRD section 10 passes with evidence on two college-target phones.

## M7 - Attendance (after MVP approval)

- [ ] Audited manual attendance and CSV report if college requires non-biometric fallback.
- [ ] Later AI adapter, consent/evaluation, liveness/spoof review, confidence policy, manual review.
- **Gate:** separate approved requirements and security/privacy review; no claimed accuracy without measured dataset results.
