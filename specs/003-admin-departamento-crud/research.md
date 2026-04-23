# Phase 0 Research: CRUD de Departamentos para Administrador

## Decision 1: Modelo de baja de departamentos
- Decision: Mantener baja logica (inactivar) y ocultar por defecto en listados.
- Rationale: Preserva trazabilidad historica de asignaciones y evita perdida de integridad referencial.
- Alternatives considered:
  - Baja fisica: descartada por riesgo de ruptura de historial.
  - Prohibir baja: descartada por limitar gestion administrativa.

## Decision 2: Visibilidad de departamentos para movimiento de empleados
- Decision: El selector de destino para mover empleados mostrara solo departamentos activos.
- Rationale: Reduce errores operativos y evita intentos de asignacion invalida a departamentos inactivos.
- Alternatives considered:
  - Mostrar activos/inactivos con etiqueta: mayor complejidad y posibilidad de confusion.
  - Mostrar inactivos y bloquear en submit: mala experiencia por error evitable.

## Decision 3: Resolucion de concurrencia en movimientos manuales
- Decision: Responder 409 CONFLICT cuando haya colision de reasignacion concurrente de un mismo empleado.
- Rationale: Evita sobrescritura silenciosa y obliga al cliente a refrescar estado antes de reintentar.
- Alternatives considered:
  - Last write wins: descartado por riesgo de inconsistencias no visibles.
  - Bloqueo pesimista de larga duracion: descartado por impacto operativo.

## Decision 4: Soporte a estado "sin departamento"
- Decision: Permitir desasignacion manual para dejar empleado sin departamento activo.
- Rationale: Es un estado de negocio valido y necesario para transiciones organizativas.
- Alternatives considered:
  - Forzar siempre departamento activo: descartado por rigidez operativa.
  - Permitir solo con rol superior: fuera del alcance actual de roles.

## Decision 5: Alcance tecnico frontend
- Decision: Extender la aplicacion Angular existente con una seccion administrativa en la misma app.
- Rationale: Reusa autenticacion/token ya operativos y minimiza tiempo de entrega.
- Alternatives considered:
  - Crear SPA separada para admin: incremento de complejidad de despliegue.
  - Operar solo por Swagger/Postman: no cumple objetivo UX solicitado.

## Decision 6: Contrato API del feature
- Decision: Mantener endpoints REST bajo `/api/departamentos` y `/api/empleados/{clave}/departamento` con respuestas 401/403/409 segun escenario.
- Rationale: Alinea el feature con el estilo actual de backend y facilita trazabilidad por OpenAPI.
- Alternatives considered:
  - Endpoints nuevos con prefijo `/admin`: innecesario para el alcance dado y duplicaria reglas existentes.
