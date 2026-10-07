# API outline

All endpoints use `/api/v1`, JSON, UTC ISO-8601 timestamps, and structured errors.

- `POST /auth/login`
- `GET /universities`
- `GET /universities/{id}/routes`
- `GET /routes/{id}/stops`
- `GET /universities`
- `GET /universities/{id}/routes`
- `GET /routes/{id}/stops`
- `POST /trips/start`
- `POST /trips/{id}/locations/batch`
- `POST /trips/start`
- `POST /trips/{id}/end`
- `GET /trips/{id}/locations/latest`
- `GET /trips/{id}/eta?stopId={stopId}&leadMinutes=10`
- `GET /routes/{id}/live`
- `PUT /subscription`
- `GET /notifications`
- `PUT /subscription`
- `GET /subscription?studentId={studentId}`
- `POST /notifications/{id}/read`
- `POST /alerts/evaluate?studentId={studentId}&tripId={tripId}&stopId={stopId}&leadMinutes=10`

Provider credentials are server-side configuration only. Student clients never receive provider tokens.
