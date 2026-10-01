# Security and Privacy

Location and future biometric data are sensitive. College approval and a clear notice/consent flow are required before real-user collection.

## Required controls

- Collect in-charge bus location only during an explicitly active trip; show persistent indicator and stop control.
- Do not collect continuous student location. The selected stop is sufficient for alerts.
- Use TLS in pilot/production, authenticated endpoints, least-privilege roles, object-level authorization, rate limits, payload limits, and audit events.
- Hash passwords with Argon2id or BCrypt. Hash bus codes and refresh tokens. Store mobile refresh tokens only in SecureStore.
- Secrets arrive through environment/secret storage; logs and API errors never contain passwords, tokens, bus codes, connection strings, or precise location histories.
- Enforce college/tenant scope on every query even though the first pilot is single-college.
- Validate coordinates, time, accuracy, speed, device/trip/assignment, sequences, and batch size.
- Apply configurable retention jobs and document deletion/export requests.
- Backups are encrypted, access controlled, tested, and retained according to college policy.

## Threats that tests must cover

- Credential stuffing and account enumeration.
- Student attempting in-charge/admin calls.
- Changing bus/trip/student IDs to access another resource.
- Replayed/fabricated location batches and impossible movement.
- Static/guessed/leaked bus code abuse.
- Token theft, refresh-token reuse, logout without revocation.
- CSV injection in future reports; prefix dangerous spreadsheet cells and use strict headers.
- Push token exposure and notification data visible on lock screen.
- Dependency/secret supply-chain issues.

## Future face recognition gate

No face image/template collection until the college approves purpose, lawful basis/consent, retention, deletion, access, encryption, spoof/liveness handling, human review, and an evaluation protocol. Measure false accept and false reject rates across real conditions; do not promise 98-100% accuracy. Provide a non-biometric fallback and appeal/correction path.
