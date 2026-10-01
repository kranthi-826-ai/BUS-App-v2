# Smart College Bus

Android-first college bus tracking and arrival-alert system. The current workspace contained only empty/corrupted directory shells, so this repository is treated as a greenfield rebuild of the earlier `BUS-App-v2` prototype.

## Product direction

- Real React Native Android app, not a website wrapper.
- Student: enrol in a bus, select a stop, see live tracking, receive arrival alerts.
- Bus in-charge: start/end trips and share live GPS from a second Android phone.
- Spring Boot is the only application backend; MySQL stores authoritative data.
- Attendance/reporting is designed into the system, but face recognition is a later feature and must not block the tracking MVP.
- Free/open-source and locally buildable tools are preferred.

## Read before building

1. [PRD](docs/PRD.md)
2. [Architecture](docs/ARCHITECTURE.md)
3. [Technology choices](docs/TECH_STACK.md)
4. [API contract](docs/API_CONTRACT.md)
5. [Data model](docs/DATA_MODEL.md)
6. [Implementation plan](docs/IMPLEMENTATION_PLAN.md)
7. [Tests and troubleshooting](docs/TEST_AND_RUNBOOK.md)
8. [Security and privacy](docs/SECURITY_PRIVACY.md)
9. [Agent rules](AGENTS.md)
10. [Gemini context](GEMINI.md)

To start the coding agent, copy [MASTER_PROMPT.md](MASTER_PROMPT.md) into Gemini 3.1 Pro from this repository root.

## Planned repository shape

```text
mobile/       Expo + React Native + TypeScript
backend/      Spring Boot + Java + Maven
database/     reference data and export/restore scripts
docs/         product and engineering source of truth
contracts/    OpenAPI contract (created during Milestone 1)
```

No implementation is claimed complete until the commands and two-phone acceptance tests in the documentation pass.
