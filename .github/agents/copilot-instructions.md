# dsw02-Prcatica01 Development Guidelines

Auto-generated from all feature plans. Last updated: 2026-03-26

## Active Technologies
- Java 17 (backend), TypeScript 5.9 (frontend), YAML Compose Spec (infra) + Spring Boot 3.4.x, Angular 21, Docker Compose v2, Nginx 1.27, PostgreSQL 16, Flyway (004-cuatro-contenedores)
- PostgreSQL 16 en contenedor dedicado con volumen persistente Docker (004-cuatro-contenedores)

- Java 17 + Spring Boot 3 (Web, Validation, Data JPA, Security), springdoc-openapi (Swagger UI), PostgreSQL Driver (001-cloud-empleados)
- Auth session module with bearer token validation, lockout policy, and audit event persistence (002-login-crud-empleados)

## Project Structure

```text
backend/
frontend/
tests/
```

## Commands

# Add commands for Java 17

## Code Style

Java 17: Follow standard conventions

## Recent Changes
- 004-cuatro-contenedores: Added Java 17 (backend), TypeScript 5.9 (frontend), YAML Compose Spec (infra) + Spring Boot 3.4.x, Angular 21, Docker Compose v2, Nginx 1.27, PostgreSQL 16, Flyway

- 002-login-crud-empleados: Added session-based login/logout flow, single-session policy, lockout, and auth audit model
- 001-cloud-empleados: Added Java 17 + Spring Boot 3 (Web, Validation, Data JPA, Security), springdoc-openapi (Swagger UI), PostgreSQL Driver

<!-- MANUAL ADDITIONS START -->
<!-- MANUAL ADDITIONS END -->
