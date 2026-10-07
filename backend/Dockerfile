FROM maven:3.9.11-eclipse-temurin-21 AS build
WORKDIR /workspace
COPY pom.xml .
COPY src src
RUN mvn -q -DskipTests package

FROM eclipse-temurin:21-jre
RUN useradd --system --uid 10001 smartbus
WORKDIR /app
COPY --from=build /workspace/target/backend-0.1.0.jar app.jar
USER smartbus
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 CMD ["sh","-c","wget -qO- http://127.0.0.1:8080/actuator/health >/dev/null || exit 1"]
ENTRYPOINT ["java","-jar","/app/app.jar"]
