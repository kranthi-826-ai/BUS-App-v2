# Build progress

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
