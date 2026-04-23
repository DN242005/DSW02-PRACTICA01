# Implementation Plan: CRUD de Departamentos para Administrador

**Branch**: `003-admin-departamento-crud` | **Date**: 2026-04-04 | **Spec**: `/specs/003-admin-departamento-crud/spec.md`
**Input**: Feature specification from `/specs/003-admin-departamento-crud/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Implementar una seccion administrativa para CRUD de departamentos y movimiento manual de empleados entre departamentos, incluyendo desasignacion a estado "sin departamento". La solucion reutiliza backend Spring Boot con restricciones por rol ADMIN, mantiene baja logica de departamentos, controla conflictos concurrentes con respuesta 409 y añade interfaz frontend administrativa en Angular para operar estos flujos.

## Technical Context

**Language/Version**: Java 17 (backend), TypeScript/Angular 21 (frontend)  
**Primary Dependencies**: Spring Boot 3 (Web, Validation, Data JPA, Security), Flyway, springdoc-openapi, Angular HttpClient + Forms  
**Storage**: PostgreSQL 16 (tablas de departamentos y asignaciones ya existentes, con nuevas reglas de uso)  
**Testing**: JUnit 5 + Spring Boot Test para backend, pruebas manuales guiadas para frontend en quickstart  
**Target Platform**: Contenedores Docker locales (backend 8080, frontend 4200, postgres 5432)  
**Project Type**: web application fullstack (backend API + frontend Angular)  
**Performance Goals**: p95 < 2s para CRUD de departamentos y movimientos manuales de empleados  
**Constraints**: Solo rol ADMIN puede operar este feature; selector de destino solo muestra departamentos activos; baja de departamento es logica; conflicto concurrente devuelve 409; debe permitirse desasignacion manual  
**Scale/Scope**: Operacion administrativa interna de bajo/medio volumen, orientada a gestion manual

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Gate Review (Pre-Phase 0)

- Archivo de constitucion actual en `.specify/memory/constitution.md` se encuentra en estado template con placeholders y sin principios ejecutables definidos.
- Resultado de gate: PASS condicional por ausencia de reglas normativas concretas.
- Riesgo identificado: Se recomienda ratificar constitucion antes de features de mayor impacto transversal.

**Resultado**: PASS (sin bloqueos formales detectados).

## Project Structure

### Documentation (this feature)

```text
specs/003-admin-departamento-crud/
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
│   ├── config/
│   ├── departamento/
│   ├── empleado/
│   └── shared/
├── src/main/resources/db/migration/
└── frontend/src/app/
```

**Structure Decision**: Se mantiene el backend existente por modulos (`departamento`, `empleado`, `auth`) y se extiende el frontend actual en `frontend/src/app` para agregar la seccion administrativa de departamentos y movimiento de empleados.

## Complexity Tracking

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| Ninguna | N/A | N/A |

## Constitution Check (Post-Phase 1 Design)

- Se mantiene el mismo estado de gate que pre-Phase 0: no hay principios ratificados en el archivo de constitucion para validar incumplimientos concretos.
- Artefactos de diseno se mantienen alineados con el stack y patrones existentes del repositorio.

**Resultado**: PASS. Feature lista para `/speckit.tasks`.
