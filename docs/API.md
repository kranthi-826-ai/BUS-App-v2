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
- `GET /routes/{id}/live`
- `PUT /subscription`
- `GET /notifications`

Provider credentials are server-side configuration only. Student clients never receive provider tokens.
