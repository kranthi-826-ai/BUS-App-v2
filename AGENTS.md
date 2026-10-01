# Agent Operating Contract

These rules apply to every coding agent working in this repository.

## Source of truth and priority

1. `docs/PRD.md` defines product behaviour and scope.
2. `docs/ARCHITECTURE.md`, `docs/API_CONTRACT.md`, and `docs/DATA_MODEL.md` define technical boundaries.
3. `docs/IMPLEMENTATION_PLAN.md` defines build order and gates.
4. If documents conflict, stop, record the conflict, and choose the safer minimal interpretation. Do not silently invent requirements.

## Mandatory workflow

1. Inspect the repository and `git status` before editing.
2. Work on exactly one milestone at a time.
3. Write or update tests with each behaviour change.
4. Run the milestone validation commands before claiming success.
5. Fix root causes; do not disable tests, validation, authentication, permissions, or type checking.
6. Update `docs/IMPLEMENTATION_PLAN.md` only after evidence passes.
7. Report changed files, commands run, results, remaining risks, and the next milestone.

## Engineering rules

- Mobile is TypeScript with strict mode. Avoid `any`; centralize API access and runtime validation.
- Backend uses Java 21, Maven Wrapper, layered packages, DTOs, Bean Validation, Spring Security, Flyway, and structured errors.
- Never expose JPA entities directly from controllers.
- Never store plain-text passwords, tokens, bus codes, or secrets.
- Mobile never connects directly to MySQL. Future AI never connects directly to MySQL.
- Use UTC timestamps in storage and ISO-8601 over APIs; display in the device locale.
- Every write that can be retried must be idempotent or protected against duplicates.
- Do not use `ddl-auto=update` outside throwaway tests; Flyway owns schema changes.
- Do not add a paid service when a documented free/local option meets the requirement.
- Do not commit `.env`, credentials, keystores, service-account JSON, student data, location traces, face images, or generated build artifacts.
- Do not promise face-recognition accuracy. AI attendance remains behind a disabled feature flag until separately evaluated and approved.

## Error protocol

When an error occurs:

1. Capture the exact command, complete error, environment/version, and smallest reproduction.
2. Classify it: environment, dependency, compile/type, test, runtime, network, database, permission, or device/vendor.
3. Check relevant official documentation and current project configuration.
4. Make the smallest reversible fix and add a regression test when possible.
5. Re-run the failing check, then the containing milestone gate.
6. After three failed approaches, stop changing code and provide an evidence table of attempts and the unresolved blocker.

Never fabricate successful command output. Never replace real behaviour with mocks in production code merely to make a demo pass.

## Definition of done

A feature is done only when acceptance criteria pass, automated tests pass, negative/error paths are covered, permissions and privacy implications are addressed, documentation is current, and the feature works on a physical Android device where applicable.
