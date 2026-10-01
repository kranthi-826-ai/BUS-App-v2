# Free/Local-First Technology Baseline

Verified on 2026-10-01. Re-check official release pages before scaffolding and record any version change.

| Area | Choice | Baseline | Cost/constraint |
|---|---|---|---|
| Mobile | Expo + React Native + TypeScript | Expo SDK 57, Node 22.13+ | Open-source tooling; local Android builds require Android Studio/JDK |
| Map | MapLibre React Native | Current compatible release | Requires Expo development build; not Expo Go |
| Tiles/style | OpenFreeMap `liberty` | Public instance for pilot | Free/no key/no stated request limit, but no SLA; preserve attribution and keep provider configurable |
| Location | `expo-location` + `expo-task-manager` | SDK-compatible | Background service permission and physical-device tests required |
| Notifications | `expo-notifications`, Expo Push/FCM | SDK-compatible | FCM is no-cost; push needs credentials and a development/release build |
| Backend | Spring Boot + Maven Wrapper | Spring Boot 4.1.1, Java 21 | Open source; current Spring Boot minimum is Java 17 |
| Database | MySQL Community LTS + Flyway | MySQL 8.4 LTS | Freely downloadable Community edition; use a non-root app user |
| API docs | springdoc/OpenAPI | Compatible stable | Contract committed in `contracts/openapi.yaml` |
| Tests | JUnit, Testcontainers, Jest, React Native Testing Library | Compatible stable | Free/open source; device acceptance remains mandatory |
| API client | Bruno collection + CLI | Current stable | Open-source, commit-friendly alternative to manual-only Postman work |
| CI | GitHub Actions | Current | Free for public repositories; quotas apply to private repositories |
| Monitoring | Spring Actuator + Micrometer/Prometheus/Grafana | Optional pilot profile | Self-hostable; structured JSON logs always enabled |
| Build agent | Gemini CLI/Antigravity with Gemini 3.1 Pro | `gemini-3.1-pro-preview` | Model is preview; Antigravity free-plan limits may apply; direct API is not assumed free |

## Official references

- [Expo SDK reference](https://docs.expo.dev/versions/latest/)
- [Expo background location](https://docs.expo.dev/versions/latest/sdk/location/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/introduction/)
- [Expo push setup](https://docs.expo.dev/push-notifications/push-notifications-setup/)
- [MapLibre Expo setup](https://maplibre.org/maplibre-react-native/docs/setup/expo/)
- [OpenFreeMap service and terms summary](https://openfreemap.org/)
- [OpenStreetMap tile policy](https://operations.osmfoundation.org/policies/tiles/) (do not use OSM community tiles as an unlimited production backend)
- [Firebase pricing: FCM is no-cost](https://firebase.google.com/pricing)
- [Spring Boot requirements](https://docs.spring.io/spring-boot/system-requirements.html)
- [MySQL 8.4 LTS release model](https://dev.mysql.com/doc/refman/8.4/en/mysql-releases.html)
- [Gemini 3.1 Pro model](https://ai.google.dev/gemini-api/docs/models/gemini-3.1-pro-preview)
- [Gemini CLI `GEMINI.md` context](https://github.com/google-gemini/gemini-cli/blob/main/docs/cli/gemini-md.md)

## Version policy

Pin direct dependencies and commit lockfiles. Use framework-native installers (`npx expo install`) for Expo compatibility. Dependabot/Renovate updates must pass all gates; no unreviewed major upgrade during the college pilot.
