# Tasks: CRUD de Departamentos para Administrador

**Input**: Design documents from `/specs/003-admin-departamento-crud/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tareas de pruebas automatizadas porque la especificacion no solicita enfoque TDD explicito.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear contrato, documentacion operativa y estructura base del feature

- [X] T001 Actualizar contrato inicial del feature con escenarios CRUD/movimiento en specs/003-admin-departamento-crud/contracts/openapi.yaml
- [X] T002 Definir flujo de validacion manual de la funcionalidad administrativa en specs/003-admin-departamento-crud/quickstart.md
- [X] T003 [P] Documentar alcance funcional y restricciones de rol en specs/003-admin-departamento-crud/spec.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura comun que bloquea la implementacion de todas las historias

**CRITICAL**: Ninguna historia puede iniciar hasta completar esta fase

- [X] T004 Incorporar respuesta estandar de conflicto 409 para reasignaciones concurrentes en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/shared/api/GlobalExceptionHandler.java
- [X] T005 [P] Extender consultas de departamentos activos/inactivos en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/infrastructure/DepartamentoRepository.java
- [X] T006 [P] Extender consultas de historial vigente por empleado para reasignacion atomica en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/infrastructure/HistorialAsignacionDepartamentoRepository.java
- [X] T007 Asegurar reglas base de autorizacion para endpoints administrativos en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/SecurityConfig.java
- [X] T008 Preparar mapeo comun de DTOs de departamento y asignacion para vistas administrativas en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/dto/DepartamentoDtos.java

**Checkpoint**: Fundacion lista, historias de usuario habilitadas

---

## Phase 3: User Story 1 - Gestionar departamentos (Priority: P1) 🎯 MVP

**Goal**: Permitir al administrador crear, listar, editar e inactivar departamentos con reglas de negocio

**Independent Test**: Login como admin, crear departamento, editarlo, listar activos e inactivarlo sin depender de movimiento de empleados

### Implementation for User Story 1

- [X] T009 [US1] Implementar validaciones de nombre obligatorio y unicidad entre activos en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/DepartamentoService.java
- [X] T010 [P] [US1] Implementar campo descripcion y estado activo en respuestas de API en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/dto/DepartamentoDtos.java
- [X] T011 [US1] Implementar listado por defecto de departamentos activos con opcion de incluir inactivos en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/DepartamentoController.java
- [X] T012 [US1] Implementar actualizacion de departamento existente con validaciones de negocio en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/DepartamentoService.java
- [X] T013 [US1] Implementar baja logica de departamento bloqueando casos con empleados activos asignados en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/DepartamentoService.java
- [X] T014 [US1] Ajustar endpoint DELETE para responder 204/409 segun reglas de inactivacion en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/DepartamentoController.java
- [X] T015 [P] [US1] Implementar seccion UI de CRUD de departamentos para administrador en dsw02-Prcatica01/frontend/src/app/app.component.html
- [X] T016 [US1] Implementar estado y operaciones frontend de crear/listar/editar/inactivar departamentos en dsw02-Prcatica01/frontend/src/app/app.component.ts
- [X] T017 [P] [US1] Aplicar estilos de tabla/formulario para modulo de departamentos en dsw02-Prcatica01/frontend/src/app/app.component.css

**Checkpoint**: US1 funcional y validable de forma independiente

---

## Phase 4: User Story 2 - Mover empleado manualmente de departamento (Priority: P2)

**Goal**: Permitir al administrador asignar, reasignar y desasignar empleados de forma manual

**Independent Test**: Con departamentos activos creados, mover un empleado a otro departamento y luego desasignarlo a sin departamento

### Implementation for User Story 2

- [X] T018 [US2] Implementar validacion de destino activo/existente para movimiento manual en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/EmpleadoDepartamentoService.java
- [X] T019 [P] [US2] Implementar cierre de asignacion vigente y alta de nueva asignacion en transaccion en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/EmpleadoDepartamentoService.java
- [X] T020 [US2] Implementar deteccion de colision concurrente y lanzamiento de conflicto 409 en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/application/EmpleadoDepartamentoService.java
- [X] T021 [US2] Implementar desasignacion manual a estado sin departamento en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/EmpleadoDepartamentoController.java
- [X] T022 [P] [US2] Ajustar request/response de asignacion para movimiento y desasignacion en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/dto/EmpleadoDepartamentoDtos.java
- [X] T023 [US2] Exponer selector de departamentos activos y opcion sin departamento en dsw02-Prcatica01/frontend/src/app/app.component.html
- [X] T024 [US2] Implementar acciones frontend para mover y desasignar empleados con manejo de 409 en dsw02-Prcatica01/frontend/src/app/app.component.ts
- [X] T025 [P] [US2] Mostrar mensajes de exito/error para movimiento manual en dsw02-Prcatica01/frontend/src/app/app.component.css
- [X] T026 [US2] Alinear contrato OpenAPI de movimiento y desasignacion con respuestas 409 en specs/003-admin-departamento-crud/contracts/openapi.yaml

**Checkpoint**: US1 y US2 funcionales y validables de forma independiente

---

## Phase 5: User Story 3 - Validar permisos de administrador (Priority: P3)

**Goal**: Restringir CRUD de departamentos y movimiento manual a rol ADMIN en backend y frontend

**Independent Test**: Login como usuario EMPLEADO, intentar CRUD/movimiento y verificar rechazo por permisos en API y UI

### Implementation for User Story 3

- [X] T027 [US3] Asegurar autorizacion ADMIN en endpoints de departamentos y asignaciones en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/SecurityConfig.java
- [X] T028 [P] [US3] Aplicar restricciones declarativas por rol en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/DepartamentoController.java
- [X] T029 [P] [US3] Aplicar restricciones declarativas por rol en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/EmpleadoDepartamentoController.java
- [X] T030 [US3] Garantizar exposicion de rol de usuario autenticado para decision de UI en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/api/dto/AuthDtos.java
- [X] T031 [US3] Ocultar o deshabilitar seccion administrativa cuando el rol no sea ADMIN en dsw02-Prcatica01/frontend/src/app/app.component.html
- [X] T032 [US3] Manejar respuestas 403 y limpiar estado de acciones no autorizadas en dsw02-Prcatica01/frontend/src/app/app.component.ts
- [X] T033 [US3] Actualizar contrato OpenAPI con respuestas 403 en operaciones administrativas en specs/003-admin-departamento-crud/contracts/openapi.yaml

**Checkpoint**: Todas las operaciones del feature protegidas por rol ADMIN

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre funcional, validacion integral y documentacion final

- [X] T034 [P] Consolidar escenarios finales de validacion en specs/003-admin-departamento-crud/quickstart.md
- [X] T035 [P] Documentar flujo de administracion de departamentos y movimiento manual en dsw02-Prcatica01/README.md
- [X] T036 Verificar consistencia de codigos 401/403/409 del feature en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/shared/api/GlobalExceptionHandler.java
- [X] T037 Ejecutar checklist final de requisitos del feature en specs/003-admin-departamento-crud/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias
- **Phase 2 (Foundational)**: Depende de Phase 1 y bloquea todas las historias
- **Phase 3 (US1)**: Depende de Phase 2
- **Phase 4 (US2)**: Depende de Phase 2 y consume componentes de departamentos de US1
- **Phase 5 (US3)**: Depende de Phase 2 y valida seguridad sobre endpoints de US1/US2
- **Phase 6 (Polish)**: Depende de historias objetivo completadas

### User Story Dependencies

- **US1 (P1)**: Primer incremento funcional (MVP)
- **US2 (P2)**: Requiere base de departamentos activos operativa (US1)
- **US3 (P3)**: Puede avanzar tras Phase 2, pero se valida completamente sobre operaciones de US1/US2

### Parallel Opportunities

- **Setup**: T003 en paralelo con T001-T002
- **Foundational**: T005 y T006 en paralelo, luego T007-T008
- **US1**: T010, T015 y T017 en paralelo despues de T009
- **US2**: T019 y T022 en paralelo antes de T024
- **US3**: T028 y T029 en paralelo, luego T031 y T032
- **Polish**: T034 y T035 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T010 [US1] Implementar campo descripcion y estado activo en DTOs"
Task: "T015 [US1] Implementar seccion UI de CRUD de departamentos"
Task: "T017 [US1] Aplicar estilos de modulo de departamentos"
```

## Parallel Example: User Story 2

```bash
Task: "T019 [US2] Implementar reasignacion transaccional"
Task: "T022 [US2] Ajustar request/response de asignacion"
Task: "T025 [US2] Mostrar mensajes de exito/error"
```

## Parallel Example: User Story 3

```bash
Task: "T028 [US3] Aplicar restricciones por rol en DepartamentoController"
Task: "T029 [US3] Aplicar restricciones por rol en EmpleadoDepartamentoController"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar CRUD de departamentos de punta a punta
5. Demostrar incremento funcional

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (CRUD de departamentos)
3. Entregar US2 (movimiento/desasignacion manual)
4. Entregar US3 (endurecimiento de permisos y UX por rol)
5. Cerrar con polish y validacion cruzada

### Parallel Team Strategy

1. Equipo completo en Phase 1 y Phase 2
2. Luego dividir:
   - Dev A: US1 backend + UI departamentos
   - Dev B: US2 backend de reasignacion + UI de movimiento
   - Dev C: US3 seguridad y experiencia por permisos
3. Integrar y validar en Phase 6
