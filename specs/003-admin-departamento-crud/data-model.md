# Data Model: CRUD de Departamentos para Administrador

## Entidad: Departamento

### Campos
- `id` (bigint, PK)
- `nombre` (string, requerido, unico entre activos)
- `descripcion` (string, opcional)
- `activo` (boolean, requerido)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Reglas
- `nombre` no puede ser vacio.
- No se permite duplicidad de nombre entre departamentos activos (normalizado).
- La eliminacion funcional es inactivacion (`activo=false`).

## Entidad: Empleado

### Campos relevantes
- `clave` (string, PK funcional, formato `EMP-<numero>`)
- `nombre` (string)
- `direccion` (string)
- `telefono` (string)

## Entidad: Asignacion de Departamento (vigente)

### Campos relevantes
- `empleadoClave` (FK logica a Empleado)
- `departamentoId` (FK a Departamento)
- `fechaInicio` (timestamp)
- `fechaFin` (timestamp nullable)

### Reglas
- Un empleado tiene como maximo una asignacion activa.
- Reasignar empleado cierra asignacion activa previa y abre una nueva.
- Desasignar deja al empleado en estado "sin departamento" (sin fila activa).

## Estado derivado: Sin Departamento

- Representa empleado sin asignacion activa vigente.
- Debe ser permitido por las reglas del feature.

## Relaciones
- `Departamento (1) -> (N) Asignaciones`
- `Empleado (1) -> (N) Asignaciones historicas`
- `Empleado (0..1) -> (1) Departamento` para estado actual (derivado)

## Validaciones de negocio clave
- Solo rol ADMIN puede crear/editar/inactivar departamentos.
- Solo rol ADMIN puede mover o desasignar empleados.
- No se puede mover a departamento inexistente o inactivo.
- Conflictos concurrentes en movimiento responden 409.
