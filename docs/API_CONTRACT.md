# API Contract Summary

Base path: `/api/v1`. The implementation milestone must create `contracts/openapi.yaml`; this document defines the required surface.

## Conventions

- JSON uses camelCase and ISO-8601 UTC timestamps.
- Successful create: `201`; successful reads: `200`; no body: `204`.
- Validation: `400`; unauthenticated: `401`; forbidden: `403`; missing: `404`; conflict: `409`; rate limited: `429`.
- Every error uses:

```json
{
  "code": "TRIP_ALREADY_ACTIVE",
  "message": "A trip is already active for this bus.",
  "fieldErrors": {},
  "correlationId": "01J...",
  "timestamp": "2026-10-01T12:00:00Z"
}
```

## Required endpoints

| Method/path | Role | Purpose |
|---|---|---|
| `POST /auth/login` | public | Credentials -> access and rotated refresh token |
| `POST /auth/refresh` | public | Rotate refresh token; reuse revokes family |
| `POST /auth/logout` | signed in | Revoke current refresh token |
| `GET /me` | signed in | Profile, role, college, assignments |
| `GET /colleges` | signed in | Available college(s) |
| `GET /buses` | signed in | Authorized/available buses |
| `GET /buses/{busId}/route` | signed in | Route and ordered stops |
| `POST /enrolments/verify` | student | Verify bus code and enrol |
| `PUT /me/boarding-stop` | student | Select enrolled-bus stop |
| `PUT /me/alert-subscription` | student | Enable/radius/push token |
| `POST /trips` | in-charge | Start assigned-bus trip; requires idempotency key |
| `GET /trips/active` | signed in | Active trips visible only to bus enrollees, assigned in-charges, and administrators |
| `POST /trips/{tripId}/pause` | in-charge | Pause an active trip and stop location publishing |
| `POST /trips/{tripId}/resume` | in-charge | Resume a paused trip |
| `POST /trips/{tripId}/end` | in-charge | End an active or paused trip |
| `POST /trips/{tripId}/locations:batch` | in-charge | Ingest one or more sequenced GPS points |
| `POST /trips/{tripId}/end` | in-charge | End trip; idempotent |
| `GET /buses/{busId}/active-trip` | enrolled/assigned | Active trip summary |
| `GET /trips/{tripId}/location/latest` | enrolled/assigned | Latest accepted location + stale flag |
| `GET /trips/{tripId}/locations?afterSequence=` | enrolled/assigned | Recovery/polling feed |
| `WS /ws/trips/{tripId}` | enrolled/assigned | Live location/status events |
| `GET /health/readiness` | operator | Safe readiness status, no secrets |

## Location payload

```json
{
  "deviceId": "installation-uuid",
  "points": [{
    "sequence": 42,
    "capturedAt": "2026-10-01T07:30:05Z",
    "latitude": 17.385,
    "longitude": 78.4867,
    "accuracyMeters": 12.5,
    "speedMps": 8.2,
    "headingDegrees": 93.0
  }]
}
```

Backend validates coordinate ranges, finite numbers, assigned device/user/bus/trip, timestamp skew, maximum batch size, sequence uniqueness, plausible accuracy/speed, and payload size.

## Stable domain errors

`INVALID_CREDENTIALS`, `TOKEN_REUSED`, `BUS_CODE_INVALID`, `BUS_CODE_EXPIRED`, `NOT_ENROLLED`, `NOT_ASSIGNED`, `TRIP_ALREADY_ACTIVE`, `TRIP_NOT_ACTIVE`, `LOCATION_STALE`, `LOCATION_INVALID`, `LOCATION_PERMISSION_REQUIRED`, `PUSH_UNAVAILABLE`, `RATE_LIMITED`.

## Phase 2/3 reserved endpoints

- `POST /trips/{tripId}/attendance/manual`
- `GET /attendance/me`
- `GET /trips/{tripId}/attendance/report.csv`
- `POST /ai/face-verifications` only when the feature flag and privacy gate are enabled.
### Authorized external tracking adapter

When the college supplies an authorized JSON tracking API, configure `EXTERNAL_TRACKING_ENABLED`, `EXTERNAL_TRACKING_BASE_URL`, and `EXTERNAL_TRACKING_API_TOKEN`. The provider must implement `GET {baseUrl}/buses/{busId}/location` and return `busId`, `latitude`, `longitude`, `capturedTime` (ISO-8601), plus optional `accuracy`, `speed`, and `heading`. The backend rejects wrong-bus, invalid-coordinate, future, or older-than-10-minute responses. Public share pages are not accepted as an API.
