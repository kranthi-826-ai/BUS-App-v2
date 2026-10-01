# Backend Service

## Local Development

### Requirements
- Java 21
- Docker (for MySQL)

### Running Database
Run the following to start a local MySQL 8.4 instance on port 3306:
```bash
docker-compose up -d
```

### Running Backend
```bash
./mvnw spring-boot:run
```

### Testing
```bash
./mvnw verify
```
