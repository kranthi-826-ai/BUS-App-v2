# Implementation Plan

Agents must complete one milestone and its gate before starting the next. Checkboxes are evidence, not aspiration.

## M0 - Recover a clean repository

- [x] Back up any useful external prototype separately.
- [x] Remove/replace corrupted `.git` and `node_modules` only with explicit user approval.
- [x] Initialize Git, `.gitignore`, formatting, secret scanning, and baseline CI.
- **Gate:** clean `git status`; no tracked dependencies/secrets; CI can execute placeholder checks.

## M1 - Contracts and runnable skeletons

- [x] Create `mobile/` with Expo SDK 57 TypeScript strict development-build workflow.
- [x] Create `backend/` with Java 21, Spring Boot 3.5.x, Maven Wrapper.
- [x] Create OpenAPI, Flyway baseline, profiles, health endpoint, and local compose/native-MySQL instructions.
- **Gate:** mobile typecheck/lint/test; backend `./mvnw verify`; database migration from empty succeeds.

## M2 - Authentication and authorization

- [x] Approved account seed/import, secure login/refresh/logout, SecureStore, roles, audit events, rate limits.
- **Gate:** positive/negative integration tests including refresh reuse, disabled user, cross-role access, and no secret leakage.

## M3 - Transport configuration and enrolment

- [x] College, buses, routes, ordered stops, assignments, hashed expiring bus codes, student stop selection.
- **Gate:** no hardcoded business data in mobile; invalid/expired/wrong-bus code tests; seed data produces a usable pilot route.

## M4 - Real trip/location pipeline

- [x] Trip lifecycle, bounded offline queue, batch ingest, latest location, stale state, and authenticated location APIs.
- **Gate:** automated authorization, duplicate, stale, and invalid-location tests pass. Physical background publishing and two-device tracking remain release-validation work.

## M5 - Arrival alerts

- [x] Subscription UI, alert state/outbox persistence, and in-app fallback boundary.
- **Gate:** automated alert behavior passes; physical background notification, provider credentials, and receipt/retry validation remain release-validation work.

## M6 - Pilot hardening

- [ ] Accessibility, battery/data measurement, structured logs/metrics, backups, restore, HTTPS deployment, release APK, operator and privacy material.
- **Gate:** full release checklist in PRD section 10 requires physical-device evidence; local automated gates are complete, but this milestone is not yet release-complete.

## M7 - Attendance (after MVP approval)

- [x] Audited manual attendance and CSV report if college requires non-biometric fallback.
- [x] Later AI adapter, consent/evaluation, liveness/spoof review, confidence policy, manual review.
- **Gate:** separate approved requirements and security/privacy review; no claimed accuracy without measured dataset results.
