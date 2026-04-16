# Data Model: Entorno con Cuatro Contenedores Separados

## Entidad: ContenedorDeRol

### Campos
- `name` (string, requerido): identificador del servicio en compose.
- `role` (enum, requerido): `backend | frontend | database | proxy`.
- `runtimeState` (enum, requerido): `stopped | starting | healthy | degraded | failed`.
- `restartPolicy` (string, requerido): politica de reinicio del contenedor.
- `hostPortExposed` (boolean, requerido): indica si publica puerto al host.
- `internalPorts` (array<int>, requerido): puertos de escucha internos.

### Reglas
- Deben existir exactamente 4 instancias de `ContenedorDeRol` por stack.
- Cada `role` debe ser unico en el stack.
- Solo la entidad con `role=proxy` puede tener `hostPortExposed=true`.
- Para `role=backend` y `role=database`, `hostPortExposed` debe ser `false`.

## Entidad: DefinicionEntorno

### Campos
- `stackName` (string, requerido)
- `networkName` (string, requerido)
- `services` (array<ContenedorDeRol>, requerido)
- `volumes` (array<string>, requerido)
- `readinessChecks` (array<ReadinessCheck>, requerido)

### Reglas
- `services.length` debe ser 4.
- Debe existir una red compartida para conectividad interna.
- Debe existir al menos un volumen persistente para base de datos.

## Entidad: ReadinessCheck

### Campos
- `targetRole` (enum, requerido): rol evaluado.
- `type` (enum, requerido): `healthcheck | functional-flow`.
- `successCriteria` (string, requerido)

### Reglas
- Debe existir check de `healthcheck` para database, backend y proxy.
- Debe existir al menos un check `functional-flow` via proxy.
- El estado global del entorno pasa a `ready` solo cuando todos los checks requeridos pasan.

## Entidad: EstadoDespliegue

### Campos
- `timestamp` (datetime, requerido)
- `containerStates` (map<role,state>, requerido)
- `isReady` (boolean, requerido)
- `failureSummary` (string, opcional)

### Reglas
- `isReady=true` requiere cuatro contenedores en estado operativo y flujo funcional via proxy exitoso.
- Si un contenedor falla, el sistema debe reflejar `degraded` mientras ocurre el auto-restart del afectado.

## Entidad: PoliticaPersistenciaDB

### Campos
- `volumeName` (string, requerido)
- `defaultPersistence` (boolean, requerido)
- `explicitResetAction` (string, requerido)

### Reglas
- `defaultPersistence` debe ser `true`.
- `explicitResetAction` debe estar documentada y separada del flujo de arranque normal.

## Relaciones
- `DefinicionEntorno` 1 -> N `ContenedorDeRol`
- `DefinicionEntorno` 1 -> N `ReadinessCheck`
- `DefinicionEntorno` 1 -> 1 `PoliticaPersistenciaDB`
- `EstadoDespliegue` referencia una `DefinicionEntorno` activa

## Transiciones de Estado

### Estado de contenedor
- `stopped -> starting -> healthy`
- `healthy -> failed -> starting -> healthy` (auto-restart del contenedor fallido)
- `starting -> failed` (si no cumple readiness)

### Estado global del entorno
- `not_initialized -> booting -> ready`
- `ready -> degraded` (falla parcial de un contenedor)
- `degraded -> ready` (recuperacion automatica exitosa)
