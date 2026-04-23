# Tasks: Roles Admin y Empleado

**Input**: Design documents from `/specs/002-roles-admin-empleado/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: No se incluyen tareas de pruebas automatizadas porque la especificacion no solicita enfoque TDD explicito.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Alinear contrato, contexto y base documental del feature

- [X] T001 Actualizar contrato base de roles y permisos en specs/002-roles-admin-empleado/contracts/openapi.yaml
- [X] T002 Definir estrategia de migracion de auth multiusuario en dsw02-Prcatica01/src/main/resources/db/migration/V6__create_auth_user_and_roles.sql
- [X] T003 [P] Documentar variables y usuarios iniciales por rol en dsw02-Prcatica01/README.md

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestructura de autenticacion/autorizacion que bloquea todas las historias

**CRITICAL**: Ninguna historia puede iniciar hasta completar esta fase

- [X] T004 Crear enum de roles de usuario en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/domain/UserRole.java
- [X] T005 Crear entidad de usuario autenticable con rol fijo y relacion opcional a empleado en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/domain/AuthUser.java
- [X] T006 [P] Crear repositorio de usuarios autenticables en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/infrastructure/AuthUserRepository.java
- [X] T007 Extender migracion de auth para usuarios multiusuario y rol en dsw02-Prcatica01/src/main/resources/db/migration/V6__create_auth_user_and_roles.sql
- [X] T008 [P] Extender sesion auth para asociar `userId` y motivo `ROLE_CHANGED` en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/domain/AuthSession.java
- [X] T009 Refactorizar servicio de autenticacion para login multiusuario por `username/password` en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/application/AuthService.java
- [X] T010 [P] Actualizar filtro de sesion para poblar autoridades segun rol autenticado en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/AuthSessionFilter.java
- [X] T011 Actualizar configuracion de seguridad para responder 403 en permisos insuficientes en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/SecurityConfig.java
- [X] T012 Implementar invalidacion inmediata de sesiones por cambio de rol en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/application/AuthService.java
- [X] T013 [P] Agregar mapeo uniforme de error `FORBIDDEN` en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/shared/api/GlobalExceptionHandler.java
- [X] T014 Inicializar usuarios semilla de Admin y Empleado en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/application/AuthCredentialInitializer.java

**Checkpoint**: Fundacion lista, historias de usuario habilitadas

---

## Phase 3: User Story 1 - Administracion Completa por Rol Admin (Priority: P1) 🎯 MVP

**Goal**: Permitir a Admin CRUD completo de empleados/departamentos y gestion de asignaciones

**Independent Test**: Iniciar sesion como Admin y ejecutar create/read/update/delete en empleados y departamentos, ademas de asignar/remover departamento a empleado

### Implementation for User Story 1

- [ ] T015 [US1] Restringir operaciones de escritura de empleados a rol Admin en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/empleado/api/EmpleadoController.java
- [ ] T016 [US1] Restringir operaciones de escritura de departamentos a rol Admin en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/DepartamentoController.java
- [ ] T017 [US1] Restringir operaciones de asignacion/remocion a rol Admin en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/departamento/api/EmpleadoDepartamentoController.java
- [ ] T018 [P] [US1] Ajustar reglas de autorizacion declarativas en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/SecurityConfig.java
- [ ] T019 [US1] Actualizar contrato OpenAPI con respuestas 403 para operaciones Admin-only en specs/002-roles-admin-empleado/contracts/openapi.yaml

**Checkpoint**: Admin puede administrar de punta a punta sin restricciones indebidas

---

## Phase 4: User Story 2 - Lectura Restringida por Rol Empleado (Priority: P2)

**Goal**: Permitir lectura a Empleado sin exponer datos sensibles de terceros

**Independent Test**: Login como Empleado, consulta de perfil propio completo, consulta de terceros solo con `clave/nombre/departamentoActual`, y rechazo de cualquier escritura

### Implementation for User Story 2

- [ ] T020 [P] [US2] Crear DTO de vista resumida para terceros en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/empleado/api/dto/EmpleadoResumenResponse.java
- [ ] T021 [US2] Implementar consulta de perfil propio completo para rol Empleado en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/empleado/application/EmpleadoService.java
- [ ] T022 [US2] Implementar consulta de terceros con campos limitados para rol Empleado en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/empleado/application/EmpleadoService.java
- [ ] T023 [US2] Ajustar endpoints GET de empleados para respuesta por contexto de rol en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/empleado/api/EmpleadoController.java
- [ ] T024 [P] [US2] Actualizar reglas de autorizacion para lectura Empleado y escritura bloqueada en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/config/SecurityConfig.java
- [ ] T025 [US2] Alinear contrato OpenAPI para lecturas limitadas de Empleado en specs/002-roles-admin-empleado/contracts/openapi.yaml

**Checkpoint**: Empleado tiene solo lectura permitida con proteccion de campos sensibles

---

## Phase 5: User Story 3 - Experiencia de Frontend Segun Permisos (Priority: P3)

**Goal**: Mostrar acciones y datos de UI segun rol autenticado real

**Independent Test**: Login con Admin y Empleado validando diferencias de acciones y visibilidad de campos

### Implementation for User Story 3

- [ ] T026 [US3] Extender respuesta de login para incluir `role` en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/api/dto/AuthDtos.java
- [ ] T027 [US3] Exponer endpoint `/auth/me` para contexto de sesion y rol en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/auth/api/AuthController.java
- [ ] T028 [US3] Implementar lectura de contexto de sesion en dsw02-Prcatica01/frontend/src/app/app.component.ts
- [ ] T029 [US3] Adaptar UI para ocultar acciones de escritura a Empleado en dsw02-Prcatica01/frontend/src/app/app.component.html
- [ ] T030 [US3] Ajustar presentacion de datos para lectura limitada de terceros en dsw02-Prcatica01/frontend/src/app/app.component.ts
- [ ] T031 [US3] Alinear contrato OpenAPI con `role` en login y `/auth/me` en specs/002-roles-admin-empleado/contracts/openapi.yaml

**Checkpoint**: Frontend refleja permisos reales por rol sin exponer acciones o datos no permitidos

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Cierre funcional y coherencia transversal

- [ ] T032 [P] Actualizar guia de validacion por rol en specs/002-roles-admin-empleado/quickstart.md
- [ ] T033 [P] Documentar matriz final de permisos y credenciales de prueba en dsw02-Prcatica01/README.md
- [ ] T034 Verificar consistencia final de codigos 401/403 en dsw02-Prcatica01/src/main/java/com/prcatica01/empleado/shared/api/GlobalExceptionHandler.java
- [ ] T035 Ejecutar checklist final del feature en specs/002-roles-admin-empleado/checklists/requirements.md

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: Sin dependencias
- **Phase 2 (Foundational)**: Depende de Phase 1 y bloquea todas las historias
- **Phase 3 (US1)**: Depende de Phase 2
- **Phase 4 (US2)**: Depende de Phase 2
- **Phase 5 (US3)**: Depende de Phase 2 y consume cambios de API de roles
- **Phase 6 (Polish)**: Depende de historias objetivo completadas

### User Story Dependencies

- **US1 (P1)**: Primer incremento funcional de mayor valor (MVP)
- **US2 (P2)**: Requiere auth/autorizacion base de Phase 2
- **US3 (P3)**: Requiere rol disponible en respuestas de auth y reglas de acceso ya operativas

### Parallel Opportunities

- **Setup**: T003 paralelo a T001-T002
- **Foundational**: T006, T008, T010 y T013 en paralelo despues de T004-T005-T007
- **US1**: T018 paralelo con T015-T017
- **US2**: T020 y T024 en paralelo antes del ajuste final de endpoints
- **US3**: T028 y T029 en paralelo despues de T026-T027
- **Polish**: T032 y T033 en paralelo

---

## Parallel Example: User Story 1

```bash
Task: "T015 [US1] Restringir escritura de empleados a Admin"
Task: "T016 [US1] Restringir escritura de departamentos a Admin"
Task: "T017 [US1] Restringir escritura de asignaciones a Admin"
```

## Parallel Example: User Story 2

```bash
Task: "T020 [US2] Crear DTO de vista resumida de terceros"
Task: "T024 [US2] Ajustar reglas de autorizacion para lectura Empleado"
```

## Parallel Example: User Story 3

```bash
Task: "T028 [US3] Implementar lectura de contexto de sesion en frontend"
Task: "T029 [US3] Ocultar acciones de escritura para Empleado en UI"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Completar Phase 1 (Setup)
2. Completar Phase 2 (Foundational)
3. Completar Phase 3 (US1)
4. Validar flujo Admin de CRUD y asignaciones
5. Demostrar incremento funcional

### Incremental Delivery

1. Setup + Foundational
2. Entregar US1 (Admin)
3. Entregar US2 (Empleado lectura restringida)
4. Entregar US3 (UX por rol)
5. Cerrar con polish y validacion cruzada

### Team Parallelization Strategy

1. Equipo completo en Phase 1 y Phase 2
2. Luego dividir:
   - Dev A: US1 (reglas Admin)
   - Dev B: US2 (lectura restringida Empleado)
   - Dev C: US3 (frontend por rol)
3. Integrar y validar en Phase 6
