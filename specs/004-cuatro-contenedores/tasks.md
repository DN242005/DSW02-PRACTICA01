# Tasks: Entorno con Cuatro Contenedores Separados

**Input**: Design documents from /specs/004-cuatro-contenedores/
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/container-stack.yaml, quickstart.md

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar estructura de infraestructura para el stack de cuatro contenedores

- [X] T001 Revisar y actualizar descripcion de stack en docker/postgres/README.md para objetivo de 4 contenedores separados
- [X] T002 Crear plantilla de configuracion para proxy dedicado en docker/proxy/nginx.conf
- [X] T003 [P] Crear docker/proxy/Dockerfile para imagen del contenedor edge-proxy
- [X] T004 [P] Definir variables de entorno de compose para red interna y puertos en docker/postgres/.env.example

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Definir base tecnica del compose y reglas globales que bloquean cualquier historia

**CRITICAL**: Ninguna historia de usuario inicia antes de completar esta fase

- [X] T005 Refactorizar docker/postgres/docker-compose.yml para declarar exactamente 4 servicios (postgres, empleado-service, empleado-frontend, edge-proxy)
- [X] T006 Configurar red interna compartida y eliminar exposicion de puertos de empleado-service y postgres en docker/postgres/docker-compose.yml
- [X] T007 Configurar edge-proxy como unico servicio con puerto publicado al host en docker/postgres/docker-compose.yml
- [X] T008 Implementar dependencias de arranque con condiciones de salud para postgres y backend en docker/postgres/docker-compose.yml
- [X] T009 [P] Agregar/ajustar healthcheck HTTP del backend en docker/postgres/docker-compose.yml
- [X] T010 [P] Agregar/ajustar healthcheck del proxy en docker/postgres/docker-compose.yml
- [X] T011 Alinear enrutamiento de proxy hacia frontend y backend en docker/proxy/nginx.conf
- [X] T012 Establecer politica de reinicio por servicio (sin reinicio global) en docker/postgres/docker-compose.yml

**Checkpoint**: Base de compose lista; historias de usuario pueden implementarse

---

## Phase 3: User Story 1 - Levantar entorno completo (Priority: P1) MVP

**Goal**: Poder iniciar y detener el entorno con exactamente cuatro contenedores separados

**Independent Test**: Ejecutar docker compose up -d y verificar 4 contenedores activos con roles backend/frontend/db/proxy

### Implementation for User Story 1

- [X] T013 [US1] Ajustar build y definicion del servicio frontend para funcionar detras de proxy en docker/postgres/docker-compose.yml
- [X] T014 [US1] Ajustar definicion del servicio backend para comunicacion solo interna en docker/postgres/docker-compose.yml
- [X] T015 [US1] Ajustar definicion del servicio postgres con persistencia por volumen en docker/postgres/docker-compose.yml
- [X] T016 [US1] Registrar comando de arranque estandar del stack en specs/004-cuatro-contenedores/quickstart.md
- [X] T017 [US1] Registrar comando de detencion estandar del stack en specs/004-cuatro-contenedores/quickstart.md
- [X] T018 [US1] Documentar verificacion de conteo exacto de contenedores en specs/004-cuatro-contenedores/quickstart.md

**Checkpoint**: US1 funcional y comprobable de forma independiente

---

## Phase 4: User Story 2 - Operar acceso por proxy (Priority: P2)

**Goal**: Garantizar que el acceso funcional se realiza por un punto unico de entrada (proxy)

**Independent Test**: Acceder por proxy y validar que UI y endpoints backend responden sin exponer backend/db al host

### Implementation for User Story 2

- [X] T019 [US2] Configurar rutas de proxy para frontend y API (/api, /auth, /swagger-ui, /v3/api-docs) en docker/proxy/nginx.conf
- [X] T020 [US2] Configurar upstreams del proxy hacia empleado-frontend y empleado-service en docker/proxy/nginx.conf
- [X] T021 [US2] Eliminar acceso directo de frontend al host (sin puertos publicados) en docker/postgres/docker-compose.yml
- [X] T022 [US2] Validar y documentar comportamiento de error de proxy ante backend no disponible en specs/004-cuatro-contenedores/quickstart.md
- [X] T023 [US2] Documentar criterio de "entorno listo" con flujo funcional via proxy en specs/004-cuatro-contenedores/quickstart.md

**Checkpoint**: US2 funcional y comprobable de forma independiente

---

## Phase 5: User Story 3 - Completar componentes faltantes (Priority: P3)

**Goal**: Completar o crear automaticamente las piezas faltantes para garantizar siempre 4 contenedores separados

**Independent Test**: Partir de configuracion incompleta, aplicar configuracion y obtener de forma estable los 4 contenedores

### Implementation for User Story 3

- [X] T024 [US3] Añadir validacion de presencia de servicios requeridos en script operativo docker/postgres/validate-stack.ps1
- [X] T025 [US3] Implementar chequeo de unicidad de roles backend/frontend/database/proxy en docker/postgres/validate-stack.ps1
- [X] T026 [US3] Implementar verificacion de que solo proxy publica puerto en docker/postgres/validate-stack.ps1
- [X] T027 [US3] Registrar contrato de validacion del stack en specs/004-cuatro-contenedores/contracts/container-stack.yaml
- [X] T028 [US3] Documentar flujo de recuperacion cuando falta un servicio en specs/004-cuatro-contenedores/quickstart.md
- [X] T029 [US3] Documentar ejecucion idempotente de validacion en specs/004-cuatro-contenedores/quickstart.md

**Checkpoint**: US3 funcional y comprobable de forma independiente

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Ajustes transversales de calidad, resiliencia y documentación final

- [X] T030 [P] Actualizar contratos operativos finales del stack en specs/004-cuatro-contenedores/contracts/container-stack.yaml
- [X] T031 [P] Completar notas de operacion y troubleshooting en docker/postgres/README.md
- [X] T032 Verificar politica de persistencia por defecto y limpieza explicita de datos en specs/004-cuatro-contenedores/quickstart.md
- [X] T033 Verificar escenario de falla simple y auto-restart por servicio en specs/004-cuatro-contenedores/quickstart.md
- [X] T034 Ejecutar validacion end-to-end del quickstart y registrar evidencia en specs/004-cuatro-contenedores/quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

- Setup (Phase 1): inicia inmediatamente
- Foundational (Phase 2): depende de Phase 1 y bloquea historias
- User Stories (Phase 3-5): dependen de completar Phase 2
- Polish (Phase 6): depende de completar historias priorizadas

### User Story Dependencies

- US1 (P1): inicia despues de Foundational; no depende de otras historias
- US2 (P2): inicia despues de Foundational; puede depender de artefactos de US1 en proxy
- US3 (P3): inicia despues de Foundational; usa configuracion consolidada de compose

### Within Each User Story

- Definicion tecnica de contenedores antes de documentacion operativa
- Enrutamiento proxy antes de validaciones de flujo
- Validaciones de stack antes de ejecucion idempotente documentada

---

## Parallel Opportunities

- T003 y T004 pueden ejecutarse en paralelo
- T009 y T010 pueden ejecutarse en paralelo
- T030 y T031 pueden ejecutarse en paralelo

---

## Parallel Example: User Story 1

```bash
# Ejecutar en paralelo tareas de contenedores base:
# - T014 (backend interno)
# - T015 (postgres persistente)
```

---

## Parallel Example: User Story 3

```bash
# Ejecutar en paralelo validaciones de reglas del stack:
# - T025 (unicidad de roles)
# - T026 (solo proxy expone puertos)
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Completar Phase 1
2. Completar Phase 2
3. Completar US1 (Phase 3)
4. Validar arranque/parada y conteo de 4 contenedores

### Incremental Delivery

1. US1: stack base de 4 contenedores
2. US2: acceso unificado y validacion via proxy
3. US3: validaciones de completitud/idempotencia
4. Polish: endurecer docs operativas y escenarios de fallo

### Parallel Team Strategy

1. Equipo A: compose y red interna (Phase 2)
2. Equipo B: proxy dedicado y rutas (US2)
3. Equipo C: validadores de stack y documentación de recuperación (US3)

