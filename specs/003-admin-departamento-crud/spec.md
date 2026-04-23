# Feature Specification: CRUD de Departamentos para Administrador

**Feature Branch**: `003-admin-departamento-crud`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: User description: "del lado del administrador se debe crear euna seccion para un crud de departamentos y asi poder mover manualmente al empleado a un departamento que el administrador cree"

## Clarifications

### Session 2026-04-04

- Q: Al eliminar un departamento, ¿debe ser baja física o baja lógica? → A: Baja lógica (inactivar y ocultar por defecto).
- Q: En el selector para mover empleados, ¿se muestran activos e inactivos o solo activos? → A: Solo departamentos activos.
- Q: Si hay conflicto concurrente al mover un empleado, ¿qué comportamiento aplica? → A: Responder 409 y solicitar reintento con datos actualizados.
- Q: ¿Se permite mover un empleado a “sin departamento”? → A: Sí, se permite desasignación manual.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Gestionar departamentos (Priority: P1)

Como administrador, quiero crear, consultar, editar y eliminar departamentos para mantener la estructura organizativa actualizada.

**Why this priority**: Sin la gestion de departamentos no existe la base para poder mover empleados entre areas.

**Independent Test**: Iniciar sesion como administrador, abrir la seccion de departamentos, crear uno nuevo, editar su nombre y luego eliminarlo sin depender de otros flujos.

**Acceptance Scenarios**:

1. **Given** que el administrador esta autenticado, **When** registra un departamento con nombre valido, **Then** el sistema guarda el departamento y lo muestra en la lista.
2. **Given** que existe un departamento, **When** el administrador actualiza sus datos, **Then** la lista refleja los cambios inmediatamente.
3. **Given** que existe un departamento sin empleados activos asignados, **When** el administrador lo elimina, **Then** el sistema lo marca como inactivo y deja de mostrarlo en la lista de activos por defecto.

---

### User Story 2 - Mover empleado manualmente de departamento (Priority: P2)

Como administrador, quiero mover manualmente a un empleado a un departamento creado para mantener la asignacion correcta del personal.

**Why this priority**: Este es el objetivo funcional central del requerimiento y depende de la existencia de departamentos administrables.

**Independent Test**: Con departamentos ya creados, seleccionar un empleado desde la seccion administrativa y reasignarlo manualmente a otro departamento verificando el resultado.

**Acceptance Scenarios**:

1. **Given** que existe un empleado y al menos un departamento activo, **When** el administrador asigna el empleado a un departamento, **Then** el empleado queda vinculado al departamento seleccionado.
2. **Given** que un empleado ya tiene departamento, **When** el administrador lo mueve manualmente a otro, **Then** la asignacion activa cambia al nuevo departamento.
3. **Given** que un empleado tiene departamento asignado, **When** el administrador selecciona la opcion "sin departamento", **Then** el empleado queda desasignado manualmente.

---

### User Story 3 - Validar permisos de administrador (Priority: P3)

Como sistema, quiero restringir estas operaciones al rol administrador para proteger la estructura organizativa.

**Why this priority**: Evita cambios no autorizados en departamentos y movimientos de empleados.

**Independent Test**: Iniciar sesion con rol no administrador e intentar acceder a la seccion de departamentos o mover empleados; el sistema debe rechazar la operacion.

**Acceptance Scenarios**:

1. **Given** un usuario sin rol administrador, **When** intenta crear, editar o eliminar departamentos, **Then** el sistema rechaza la accion por permisos insuficientes.
2. **Given** un usuario sin rol administrador, **When** intenta mover manualmente un empleado de departamento, **Then** el sistema bloquea la operacion.

### Edge Cases

- Intento de crear un departamento con nombre vacio o duplicado.
- Intento de mover empleado a un departamento inactivo o inexistente.
- Intento de eliminar un departamento que tiene empleados activos asignados.
- Conflicto por cambios concurrentes al mover el mismo empleado entre departamentos.
- Intento de desasignar a un empleado que ya esta sin departamento.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST mostrar al administrador una seccion de gestion de departamentos.
- **FR-002**: El sistema MUST permitir al administrador crear departamentos con nombre obligatorio.
- **FR-003**: El sistema MUST permitir al administrador consultar la lista de departamentos activos.
- **FR-004**: El sistema MUST permitir al administrador editar la informacion de un departamento existente.
- **FR-005**: El sistema MUST permitir al administrador aplicar baja lógica (inactivar) a departamentos sin empleados activos asignados.
- **FR-006**: El sistema MUST permitir al administrador mover manualmente un empleado a un departamento activo seleccionado.
- **FR-007**: El sistema MUST reflejar la asignacion de departamento actualizada del empleado despues de cada movimiento manual.
- **FR-008**: El sistema MUST rechazar movimientos a departamentos inexistentes o inactivos.
- **FR-009**: El sistema MUST restringir operaciones de CRUD de departamentos y movimiento de empleados al rol administrador.
- **FR-010**: El sistema MUST mostrar mensajes claros de exito o error para cada accion administrativa.
- **FR-011**: El sistema MUST ocultar departamentos inactivos en listados por defecto y permitir su consulta solo cuando se solicite explicitamente.
- **FR-012**: El sistema MUST mostrar solo departamentos activos en el selector de destino para mover empleados.
- **FR-013**: El sistema MUST responder conflicto (409) cuando ocurra una reasignacion concurrente de un mismo empleado y solicitar reintento.
- **FR-014**: El sistema MUST permitir al administrador desasignar manualmente a un empleado para dejarlo sin departamento.

### Key Entities *(include if feature involves data)*

- **Departamento**: Area organizativa administrable con identificador, nombre y estado (activo/inactivo).
- **Empleado**: Persona del sistema que puede estar asignada a un departamento activo.
- **Asignacion de Departamento**: Relacion vigente que indica en que departamento se encuentra un empleado en un momento dado.
- **Sin Departamento**: Estado valido del empleado cuando no tiene una asignacion activa a un departamento.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: El 100% de operaciones validas de crear, editar y eliminar departamentos realizadas por administrador se completa correctamente.
- **SC-002**: Al menos 95% de movimientos manuales de empleados entre departamentos se refleja en la interfaz en menos de 2 segundos.
- **SC-003**: El 100% de intentos de acceso a estas operaciones por usuarios sin rol administrador es rechazado.
- **SC-004**: Al menos 90% de usuarios administradores de prueba logra completar el flujo "crear departamento + mover empleado" sin asistencia.

## Assumptions

- Ya existe autenticacion con roles y se dispone del rol administrador activo.
- Ya existe modelo de empleado y relacion de asignacion a departamento en el sistema.
- Esta mejora se enfoca en administracion manual y no incluye reglas automaticas de reasignacion masiva.
- La seccion administrativa se integra en el frontend existente sin crear una aplicacion separada.
- El concepto de eliminar departamento en este alcance significa inactivar (baja logica), no borrar fisicamente.

## Scope Notes

- La seccion administrativa de departamentos y movimiento manual es visible solo para usuarios con rol ADMIN.
- Usuarios con rol EMPLEADO pueden autenticarse, pero no deben ver ni ejecutar acciones de CRUD de departamentos o reasignacion manual.
- El listado operativo para mover empleados debe considerar solo departamentos activos como destino.
