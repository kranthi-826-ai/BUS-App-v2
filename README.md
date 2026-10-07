# Smart College Bus Alarm

Clean rebuild from the supplied Master Build Prompt. The first pilot is Route 8 with a two-phone GPS demonstration: one phone acts as the driver/bus publisher and one as the student.

## Current milestone

Foundation: Spring Boot 3 + Java 21, MySQL 8.4, Flyway, strict mobile shell, and source-of-truth documentation.

## Principles

- Never fake live movement in production.
- Never show stale coordinates as live.
- Provider tokens stay server-side and out of Git.
- Every phase must pass its tests before the next phase begins.
