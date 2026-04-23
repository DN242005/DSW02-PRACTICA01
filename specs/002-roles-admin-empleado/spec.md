# Feature Specification: Roles Admin y Empleado

**Feature Branch**: `[002-roles-admin-empleado]`  
**Created**: 2026-04-04  
**Status**: Draft  
**Input**: User description: "agrega dos roles uno de admni y uno de empleado, el rol de admin debe de ser capaz de tener permiso de hacre un crud completo de empleados y departamentos y asiganr empleado a departamento y los empleado solo tendran permiso de lectura de otro empleado , revisa lo que tenemos en backen t fronten para hacre que funcione"

## Clarifications

### Session 2026-04-04

- Q: Como debe modelarse la autenticacion para soportar roles Admin y Empleado? -> A: Multiples usuarios autenticables, cada usuario con rol fijo (Admin o Empleado).
- Q: Que alcance de lectura debe tener el rol Empleado sobre informacion de empleados? -> A: Puede leer su propio perfil completo y consultar a otros empleados con campos limitados.
- Q: Que debe ocurrir con sesiones activas cuando cambia el rol de un usuario? -> A: Todas las sesiones activas se invalidan de inmediato y el usuario debe volver a iniciar sesion.
- Q: Que campos puede ver un Empleado al consultar a otros empleados? -> A: Solo clave, nombre y departamento actual.

## User Scenarios & Testing *(mandatory)*

<!--
  IMPORTANT: User stories should be PRIORITIZED as user journeys ordered by importance.
  Each user story/journey must be INDEPENDENTLY TESTABLE - meaning if you implement just ONE of them,
  you should still have a viable MVP (Minimum Viable Product) that delivers value.
  
  Assign priorities (P1, P2, P3, etc.) to each story, where P1 is the most critical.
  Think of each story as a standalone slice of functionality that can be:
  - Developed independently
  - Tested independently
  - Deployed independently
  - Demonstrated to users independently
-->

### User Story 1 - Administracion Completa por Rol Admin (Priority: P1)

Como usuario con rol Admin, quiero gestionar completamente empleados y departamentos, incluyendo asignaciones empleado-departamento, para operar el modulo sin bloqueos por permisos insuficientes.

**Why this priority**: Es el flujo de mayor impacto operativo, porque concentra las acciones de mantenimiento y estructura organizacional del sistema.

**Independent Test**: Puede probarse iniciando sesion como Admin y completando alta, consulta, actualizacion y baja de empleados y departamentos, incluyendo asignar y remover departamento a un empleado.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con rol Admin, **When** realiza operaciones de alta, consulta, actualizacion y baja en empleados y departamentos, **Then** el sistema permite todas las operaciones autorizadas para administracion.
2. **Given** un usuario autenticado con rol Admin, **When** asigna o remueve un empleado de un departamento, **Then** el sistema ejecuta la operacion y mantiene consistencia de la relacion entre empleado y departamento.

---

### User Story 2 - Lectura Restringida por Rol Empleado (Priority: P2)

Como usuario con rol Empleado, quiero consultar informacion de empleados en modo lectura para revisar datos sin riesgo de modificar informacion administrativa.

**Why this priority**: Asegura control de acceso por principio de minimo privilegio, reduciendo cambios no autorizados.

**Independent Test**: Puede probarse iniciando sesion como Empleado, verificando que la consulta de empleados es posible y que cualquier intento de crear, editar o eliminar se rechaza por permisos.

**Acceptance Scenarios**:

1. **Given** un usuario autenticado con rol Empleado, **When** consulta su propio perfil, **Then** el sistema devuelve su informacion completa en modo solo lectura.
2. **Given** un usuario autenticado con rol Empleado, **When** consulta informacion de otros empleados, **Then** el sistema devuelve solo clave, nombre y departamento actual.
3. **Given** un usuario autenticado con rol Empleado, **When** intenta ejecutar operaciones de escritura sobre empleados, departamentos o asignaciones, **Then** el sistema rechaza la operacion por permisos insuficientes.

---

### User Story 3 - Experiencia de Frontend Segun Permisos (Priority: P3)

Como usuario autenticado, quiero que la interfaz muestre solo acciones permitidas para mi rol, para evitar errores por intentos de operaciones que no tengo autorizadas.

**Why this priority**: Mejora claridad del flujo en frontend y reduce friccion al usar el sistema con distintos perfiles.

**Independent Test**: Puede probarse iniciando sesion con ambos roles y validando que la interfaz habilita acciones completas para Admin y solo lectura para Empleado.

**Acceptance Scenarios**:

1. **Given** una sesion de Admin, **When** el usuario navega por los modulos de empleados y departamentos, **Then** visualiza y puede ejecutar acciones de administracion completas.
2. **Given** una sesion de Empleado, **When** el usuario navega por los mismos modulos, **Then** visualiza un flujo de consulta y el sistema no expone acciones de escritura.

---

### Edge Cases

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right edge cases.
-->

- Un usuario intenta usar un token emitido para otro rol y ejecutar operaciones no permitidas.
- El rol del usuario cambia mientras tiene una sesion activa.
- El frontend conserva una vista con permisos antiguos despues de renovar sesion.
- Un usuario Empleado intenta asignar empleados a departamentos mediante una llamada directa.
- El sistema recibe una operacion de escritura sin rol valido asociado a la sesion.
- Un usuario Empleado intenta obtener campos no permitidos de otros empleados mediante consulta directa.
- Un usuario intenta reutilizar una sesion invalidada tras cambio de rol.
- Un usuario Empleado intenta consultar telefono o direccion de otros empleados.

## Requirements *(mandatory)*

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right functional requirements.
-->

### Functional Requirements

- **FR-001**: El sistema MUST definir y reconocer al menos dos roles de acceso: Admin y Empleado, asociados a usuarios autenticables individuales.
- **FR-002**: El sistema MUST permitir al rol Admin gestionar empleados con operaciones completas de alta, consulta, actualizacion y baja.
- **FR-003**: El sistema MUST permitir al rol Admin gestionar departamentos con operaciones completas de alta, consulta, actualizacion y baja.
- **FR-004**: El sistema MUST permitir al rol Admin asignar y remover empleados de departamentos.
- **FR-005**: El sistema MUST permitir al rol Empleado consultar su propio perfil completo en modo solo lectura.
- **FR-011**: El sistema MUST permitir al rol Empleado consultar a otros empleados en modo solo lectura devolviendo solo clave, nombre y departamento actual.
- **FR-006**: El sistema MUST rechazar operaciones de escritura cuando el rol autenticado sea Empleado.
- **FR-007**: El sistema MUST aplicar control de acceso consistente para todas las operaciones de empleados, departamentos y asignaciones.
- **FR-008**: El sistema MUST devolver respuestas de autorizacion denegada con un formato uniforme cuando el rol no tenga permisos suficientes.
- **FR-009**: El sistema MUST adaptar la experiencia de frontend para mostrar acciones habilitadas segun el rol autenticado.
- **FR-010**: El sistema MUST mantener compatibilidad con el flujo actual de autenticacion por sesion para incorporar multiples usuarios con rol fijo sin romper el acceso existente.
- **FR-012**: El sistema MUST invalidar inmediatamente todas las sesiones activas de un usuario cuando su rol cambie.
- **FR-013**: El sistema MUST requerir nuevo inicio de sesion despues de invalidacion por cambio de rol y bloquear reutilizacion de tokens anteriores.

### Key Entities *(include if feature involves data)*

- **Rol de Usuario**: Clasificacion de permisos de una sesion autenticada; valores requeridos Admin y Empleado.
- **Permiso de Operacion**: Regla que define si una accion de lectura o escritura esta autorizada segun rol.
- **Sesion Autenticada**: Contexto de acceso que identifica al usuario y su rol durante las operaciones del sistema.
- **Accion de Frontend**: Elemento de interfaz visible u oculto segun el conjunto de permisos del rol en sesion.

## Success Criteria *(mandatory)*

<!--
  ACTION REQUIRED: Define measurable success criteria.
  These must be technology-agnostic and measurable.
-->

### Measurable Outcomes

- **SC-001**: El 100% de operaciones administrativas de empleados, departamentos y asignaciones se completan exitosamente cuando el usuario tiene rol Admin.
- **SC-002**: El 100% de intentos de escritura realizados por usuarios con rol Empleado son rechazados por permisos insuficientes.
- **SC-003**: Al menos 95% de usuarios Empleado completan consultas de empleados en su primer intento sin recibir errores de autorizacion inesperados y sin exponer campos no permitidos de terceros.
- **SC-004**: Al menos 90% de flujos de prueba de frontend muestran acciones correctas segun rol sin exponer botones u opciones no permitidas.

## Assumptions

<!--
  ACTION REQUIRED: The content in this section represents placeholders.
  Fill them out with the right assumptions based on reasonable defaults
  chosen when the feature description did not specify certain details.
-->

- Se reutiliza el mecanismo actual de autenticacion por sesion ya disponible en el sistema.
- Cada usuario autenticable tiene un unico rol fijo durante una sesion.
- Esta entrega se enfoca en permisos por rol para empleados, departamentos y asignaciones; otras areas funcionales quedan fuera de alcance.
- El frontend actual ya cuenta con flujo de login y sera extendido para comportamientos segun rol.
- Los usuarios de prueba para ambos roles estaran disponibles en ambiente local de desarrollo.
