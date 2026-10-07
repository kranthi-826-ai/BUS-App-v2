# Test Strategy and Error Runbook

## Automated gates

Mobile commands (final scripts may wrap these):

```powershell
npm ci
npm run format:check
npm run lint
npm run typecheck
npm test -- --runInBand
npx expo-doctor
```

Backend:

```powershell
./mvnw.cmd verify
```

The backend suite includes unit tests, controller/security tests, MySQL Testcontainers integration tests, Flyway-from-empty tests, architecture tests, and OpenAPI compatibility checks.

## Mandatory physical-device scenarios

| Scenario | Expected |
|---|---|
| Foreground permission denied | Explain need; app usable except tracking role; no loop |
| Background permission denied | In-charge cannot claim background-ready; clear settings action |
| GPS disabled/poor accuracy | Health warning; invalid points not shown as reliable |
| App backgrounded/screen locked | Foreground service remains visible and publishes on target phone |
| App force-stopped | UI/runbook states tracking stopped; never imply otherwise |
| Network lost 5 minutes | Bounded queue/backoff; newest valid points sync; no duplicates |
| Student app killed/backgrounded | Push arrival alert received when supported/configured |
| Backend unavailable | Both apps show stale/offline status; no endless spinner |
| Bus crosses alert radius twice | One notification until hysteresis re-arm/new trip |
| Unauthorized user changes IDs | `403`, no data leak or write |
| Two in-charges start same bus | Exactly one trip succeeds |
| Clock skew/replayed sequence | Invalid or duplicate point rejected safely |
| Backup restored to clean DB | Users/configuration and required audit data recover |

Test at least one stock Android/Pixel-like device and one actual vendor device intended for the pilot because battery managers differ.

## Debug order

1. Save exact error and failing command/request with correlation ID.
2. Confirm versions: `node --version`, `npm --version`, `npx expo --version`, `java -version`, `./mvnw.cmd --version`, MySQL version, Android version.
3. Confirm phone and laptop network reachability; a phone cannot reach the laptop API via `localhost`.
4. Check backend readiness, logs, DB connectivity/migrations, then mobile logs.
5. Check permission state, GPS, foreground-service notification, FCM/Expo token, and vendor battery settings.
6. Reproduce with one smallest request/test before editing.
7. Apply one change; rerun the failing test and full milestone gate.

## Common failures

- **`Network request failed`:** wrong LAN IP/port, HTTP cleartext policy, firewall, server bound only to localhost, different Wi-Fi, or invalid TLS certificate.
- **Map blank:** using Expo Go with MapLibre, bad style URL, missing attribution/style network, or native app not rebuilt after plugin change.
- **No background GPS:** Expo Go, task not defined at module top level, missing Android foreground/background permissions, force-stop, or vendor battery optimization.
- **No push:** using Expo Go, missing FCM credentials/project ID, stale token, permission denied, or receipt not checked.
- **MySQL connection refused:** service stopped, wrong port, DB/user absent, bind/network mismatch, or credentials not loaded.
- **Flyway validation failed:** edited an applied migration. Restore it and add a new migration.
- **401 loop:** refresh rotation/revocation bug. Clear tokens once, inspect server audit, and test reuse handling; never weaken auth.

## Route 8 (Mothi Nagar) Fleetx shared link

The supplied public Fleetx page identifies one vehicle, `TG08V3626` (Tata Marco Polo), and reports it as **Discharged** with its internal battery discharged and its last location update approximately a day old. The page's Google Maps link exposes `17.545862, 78.404297`; treat this only as an approximate historical map position, not a verified current GPS fix or a Mothi Nagar boarding-stop coordinate. Do not seed it into `latest_bus_locations` or show it as live.

This link is a read-only Fleetx share page, not a documented location-feed/API contract. No bus telemetry should be copied into the application database until the college/Fleetx provides an authorized integration/API and the tracking device is reporting. For the pilot, route 8 must publish authenticated GPS updates from the assigned in-charge's Android phone using the app trip/location endpoints. Configure the route name and verified stop coordinates separately from GPS observations. Re-check the Fleetx share page on the day of any device troubleshooting because this share link expires.

## Incident rule

Location leak, credential exposure, unauthorized cross-college access, or incorrect active-trip assignment is release-blocking. Disable the affected feature, preserve non-sensitive evidence, rotate exposed credentials, fix with a regression test, and only then resume the pilot.
