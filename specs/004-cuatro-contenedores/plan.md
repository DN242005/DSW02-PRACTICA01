# Implementation Plan: Entorno con Cuatro Contenedores Separados

**Branch**: `004-cuatro-contenedores` | **Date**: 2026-04-12 | **Spec**: `/specs/004-cuatro-contenedores/spec.md`
**Input**: Feature specification from `/specs/004-cuatro-contenedores/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Definir y operar un entorno local con exactamente cuatro contenedores separados (backend, frontend, base de datos y proxy), con punto unico de acceso por proxy, red interna para backend/db, reinicio automatico del contenedor fallido y persistencia de datos por defecto. El enfoque tecnico usa Docker Compose con separacion estricta de roles, healthchecks para readiness y una validacion de flujo basico via proxy para declarar el entorno listo.

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript 5.9 (frontend), YAML Compose Spec (infra)  
**Primary Dependencies**: Spring Boot 3.4.x, Angular 21, Docker Compose v2, Nginx 1.27, PostgreSQL 16, Flyway  
**Storage**: PostgreSQL 16 en contenedor dedicado con volumen persistente Docker  
**Testing**: Spring Boot Test + Testcontainers (backend), smoke tests de contenedores y flujo via proxy, validacion manual de compose  
**Target Platform**: Entorno local de desarrollo con Docker Engine y Docker Compose  
**Project Type**: aplicacion web fullstack modular (backend + frontend + proxy + db)  
**Performance Goals**: arranque completo del entorno en <5 minutos y respuesta del flujo basico via proxy en <2 segundos en entorno local normal  
**Constraints**: exactamente 4 contenedores; solo proxy expone puerto al host; backend y db solo en red interna; auto-restart solo del contenedor fallido; alcance solo local  
**Scale/Scope**: 1 stack local por desarrollador con 4 servicios fijos y un flujo funcional minimo (UI + API + DB)

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Review (Pre-Phase 0)

- **I. Fullstack Modular Architecture**: PASS. Se mantiene separacion backend/frontend y se agrega proxy como borde de acceso sin mezclar responsabilidades.
- **II. Spring Boot 3 + Java 17**: PASS. No cambia el runtime backend ni sus versiones constitucionales.
- **III. Frontend Security: TLS + Email/Password Login**: PASS (alcance local). La feature se limita a desarrollo local; no introduce excepciones para non-local y mantiene el flujo de login existente.
- **IV. Data: PostgreSQL via Docker (Manjaro)**: PASS. La base de datos continua siendo PostgreSQL dockerizado con persistencia y migraciones existentes.
- **V. API Documentation via Swagger (OpenAPI)**: PASS. No se alteran endpoints de negocio; se mantiene exposicion de Swagger via proxy.

**Resultado**: PASS.

## Project Structure

### Documentation (this feature)

```text
specs/004-cuatro-contenedores/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── container-stack.yaml
└── tasks.md
```

### Source Code (repository root)

```text
Dockerfile
frontend/
├── Dockerfile
├── nginx.conf
└── src/

docker/
└── postgres/
  ├── docker-compose.yml            # sera ajustado para separar frontend y proxy
  └── README.md

src/
└── main/
  ├── java/com/prcatica01/empleado/
  └── resources/
    ├── application.yml
    └── db/migration/

specs/004-cuatro-contenedores/
└── contracts/container-stack.yaml
```

**Structure Decision**: Se mantiene el repositorio fullstack existente y se formaliza una topologia de 4 servicios en Compose. Backend y frontend conservan sus modulos; proxy pasa a contenedor dedicado de borde y frontend queda como contenedor de contenido/UI sin exposicion directa al host.

## Complexity Tracking

No additional constitution violations identified for this feature.

## Constitution Check (Post-Phase 1 Design)

- **I. Fullstack Modular Architecture**: PASS. Artefactos de diseno separan claramente backend, frontend, db y proxy.
- **II. Spring Boot 3 + Java 17**: PASS. No hay cambios de version ni desvio tecnologico.
- **III. Frontend Security: TLS + Email/Password Login**: PASS (alcance local). Se documenta explicitamente que produccion queda fuera de alcance en esta feature.
- **IV. Data: PostgreSQL via Docker (Manjaro)**: PASS. Modelo y quickstart mantienen PostgreSQL en Docker con persistencia por volumen.
- **V. API Documentation via Swagger (OpenAPI)**: PASS. La interfaz OpenAPI continua disponible via proxy; no hay ruptura de contrato API.

**Resultado**: PASS. Feature lista para Phase 2 (`/speckit.tasks`).
