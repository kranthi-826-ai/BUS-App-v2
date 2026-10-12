# Release readiness status

Updated: 2026-10-12 (Asia/Calcutta)

## Task 1 - Docker MySQL and backend

Status: BLOCKED after three attempts.

Commands and actual evidence:

1. Started Docker Desktop and ran `docker info --format '{{.ServerVersion}}'`.
   Output: `29.7.2`.
2. Ran `docker compose up -d --build` from `backend`.
   Output: timed out while downloading/building base images.
3. Re-ran `docker compose up -d --build`.
   Output: image `backend-api:latest` built, then Compose reported existing `backend-mysql-1`/network resources created by the timed-out attempt.
4. Inspected with `docker compose ps -a`, then ran `docker compose start`.
   Output: `backend-mysql-1` and `backend-api-1` were in Created state; MySQL could not start because host port 3306 is already in use.

Health, Flyway migration, and insert/read proof are therefore not yet available. No success is claimed.

## Task 2 - Route 8 stop import

Status: VERIFIED IMPLEMENTATION; DATA BLOCKED.

- The requested `stops.route8.json` was absent. Added `backend/seed/stops.route8.json` with an empty `AWAITING_COLLEGE_VERIFICATION` payload.
- Added an importer gated by `ROUTE8_IMPORT_ENABLED=false` by default and configurable with `ROUTE8_IMPORT_FILE`.
- Import requires status `VERIFIED_BY_COLLEGE`, at least one stop, valid coordinates, nonblank names, and unique positive sequence values.
- Command: `mvn test -q` from `backend`.
- Actual output: exit code 0; all tests passed, including importer validation tests.

## Task 3 - Authorized tracker integration

Status: VERIFIED IMPLEMENTATION; CREDENTIALS BLOCKED.

- Added a tracker client gated by `TRACKER_ENABLED=false`.
- It reads only `TRACKER_API_URL`, `TRACKER_API_TOKEN`, and `TRACKER_DEVICE_ID` from environment variables and validates the expected latitude, longitude, timestamp, speed, and heading response.
- Added an admin-only tracker configuration status endpoint and `backend/.env.example`; no credential or provider value is hardcoded.
- Command: `mvn test -q` from `backend`.
- Actual output: exit code 0; the disabled-by-default regression test and full backend test suite passed.

## Task 4 - OpenStreetMap

Status: VERIFIED IMPLEMENTATION.

- Added a Leaflet/OpenStreetMap map in `react-native-webview` with required OpenStreetMap attribution.
- The map renders the live bus position and supports verified route stops plus a selected student stop; until real stop data is supplied, the stops array remains intentionally empty.
- Command: `npm run typecheck` from `mobile`.
- Actual output: `tsc --noEmit` completed with exit code 0.

## Task 5 - Android APK

Status: BLOCKED BY RELEASE CREDENTIALS.

- Command checked environment variables without printing secrets.
- Actual output: `EXPO_TOKEN_MISSING` and `EAS_PROJECT_ID_MISSING`.
- Command: `npx expo config --type public`.
- Actual output: exit code 0; Expo SDK 57 configuration, Android package `com.smartbus.collegealarm`, location/background-service permissions, notification plugin, and secure-store plugin were resolved successfully.
- No EAS build was submitted and no download URL exists.

## Task 6 - Two-phone test plan and diagnostics

Status: VERIFIED IMPLEMENTATION; EXECUTION PENDING DEVICES.

- Added `TEST_PLAN.md` with exact foreground GPS, background GPS, ETA accuracy, alarm, push, offline queue, and battery tests plus a results table.
- Added bounded in-memory diagnostic logging for GPS queue/upload events and a visible Driver screen action to export logs through Android sharing.
- Command: `npm run typecheck` from `mobile`.
- Actual output: `tsc --noEmit` completed with exit code 0.
- Backend regression command: `mvn test -q` from `backend`.
- Actual output: exit code 0.

## Dependency review

Status: REVIEWED; NO COMPATIBLE AUTOMATIC FIX.

- `npm audit --omit=dev --json` reports 25 transitive findings in the Expo/Metro/React Native toolchain.
- npm's proposed automatic fixes require incompatible downgrades to Expo 44 or React Native 0.72, while this application targets Expo SDK 57/React Native 0.86.
- No forced downgrade was applied. Type checking passes on the current compatible dependency set.

## Task 7 - Human actions and consent

Status: COMPLETE DOCUMENTATION.

- Updated `HUMAN_TODO.md` with the remaining real-data, credentials, Docker, EAS, device-test, approval, and consent requirements.
- Added short driver consent and college approval text without claiming either has been signed.
