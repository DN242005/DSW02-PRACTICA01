# Implementation Plan: Roles Admin y Empleado

**Branch**: `002-roles-admin-empleado` | **Date**: 2026-04-04 | **Spec**: `/specs/002-roles-admin-empleado/spec.md`
**Input**: Feature specification from `/specs/002-roles-admin-empleado/spec.md`

## Summary

Extender el sistema actual de autenticacion por sesion bearer para soportar multiples usuarios con rol fijo (`ADMIN`, `EMPLEADO`), aplicando autorizacion por rol en backend y comportamiento de UI por permisos en frontend. Admin tendra CRUD completo de empleados y departamentos, ademas de asignacion empleado-departamento. Empleado tendra lectura de su perfil completo y lectura limitada de terceros (`clave`, `nombre`, `departamentoActual`).

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript + Angular 21 (frontend)  
**Primary Dependencies**: Spring Boot 3 (Web, Validation, Security, Data JPA), Flyway, PostgreSQL Driver, springdoc-openapi, Angular HttpClient  
**Storage**: PostgreSQL (tablas actuales de auth, empleados, departamentos e historial; se extiende modelo auth para multiusuario con rol)  
**Testing**: JUnit 5 + Spring Boot Test + MockMvc + Testcontainers (backend), pruebas manuales guiadas en frontend (alcance actual del repositorio)  
**Target Platform**: Contenedores Docker para backend/frontend + PostgreSQL local  
**Project Type**: web application (backend API REST + frontend SPA)  
**Performance Goals**: p95 < 300ms en endpoints de autorizacion (sin contar latencia de red) y sin degradacion perceptible en login/listados por validacion de rol  
**Constraints**: sesiones bearer existentes deben mantenerse compatibles; invalidacion inmediata de sesiones al cambiar rol; respuestas 401/403 consistentes; no exponer telefono/direccion de terceros a rol Empleado  
**Scale/Scope**: 2 roles base y conjunto de endpoints existentes de empleados/departamentos/asignaciones

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Review (Pre-Phase 0)

- La constitucion en `.specify/memory/constitution.md` permanece en formato plantilla sin principios ejecutables.
- No hay gates normativos verificables que bloqueen el diseno.

**Resultado**: PASS (sin reglas activas de constitucion).

## Project Structure

### Documentation (this feature)

```text
specs/002-roles-admin-empleado/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── openapi.yaml
└── tasks.md
```

### Source Code (repository root)

```text
dsw02-Prcatica01/
├── src/main/java/com/prcatica01/empleado/
│   ├── auth/
│   │   ├── api/
│   │   ├── application/
│   │   ├── domain/
│   │   └── infrastructure/
│   ├── config/
│   ├── empleado/
│   ├── departamento/
│   └── shared/
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
└── frontend/src/
    └── app/
```

**Structure Decision**: Se mantiene arquitectura actual en un backend Spring Boot con modulos por dominio y un frontend Angular separado; el feature extiende `auth` y aplica restricciones en controladores/servicios existentes de `empleado` y `departamento`, mas adaptacion de UI en `frontend/src/app`.

## Complexity Tracking

No se identifican violaciones de constitucion a justificar.

## Phase 0: Research Output

Decisiones y tradeoffs documentados en `/specs/002-roles-admin-empleado/research.md`.

## Phase 1: Design Output

- Modelo de datos y estados: `/specs/002-roles-admin-empleado/data-model.md`
- Contrato API: `/specs/002-roles-admin-empleado/contracts/openapi.yaml`
- Guia de validacion manual: `/specs/002-roles-admin-empleado/quickstart.md`

## Constitution Check (Post-Phase 1 Design)

- Se mantiene PASS: no hay reglas de constitucion activas adicionales.
- El diseno conserva stack y estructura ya implementados en el repositorio.

**Resultado**: PASS. Feature lista para `/speckit.tasks`.
