# Phase 0 Research: Roles Admin y Empleado

## Decision 1: Modelo de identidad multiusuario con rol fijo
- Decision: Evolucionar de credencial global a usuarios autenticables individuales con rol fijo (`ADMIN`, `EMPLEADO`) y estado activo.
- Rationale: Cumple clarificacion principal del spec y evita hacks de rol seleccionable en login.
- Alternatives considered:
  - Credencial unica con selector de rol en login: rompe trazabilidad y seguridad.
  - Dos credenciales globales fijas: limita escalabilidad operativa.

## Decision 2: Fuente de verdad de permisos en backend
- Decision: Validar permisos por rol en backend para todos los endpoints protegidos y devolver `403` en falta de permisos.
- Rationale: Evita confiar en frontend como capa de seguridad y mantiene comportamiento consistente.
- Alternatives considered:
  - Filtrado solo en UI: vulnerable a llamadas directas.
  - Validaciones dispersas por controlador sin regla comun: mayor riesgo de inconsistencias.

## Decision 3: Lectura limitada para terceros desde rol Empleado
- Decision: Para consultas de otros empleados por rol Empleado, exponer solo `clave`, `nombre` y `departamentoActual`; para perfil propio, mantener vista completa.
- Rationale: Implementa minimo privilegio con utilidad operativa.
- Alternatives considered:
  - Mostrar todos los campos de terceros: fuga innecesaria de datos.
  - Permitir solo perfil propio: reduce utilidad de consulta organizacional.

## Decision 4: Invalidez inmediata de sesiones al cambiar rol
- Decision: Invalidar todas las sesiones activas del usuario cuando cambie su rol y requerir login nuevamente.
- Rationale: Impide escalamiento o retencion de privilegios antiguos en sesiones vivas.
- Alternatives considered:
  - Aplicar cambio solo a nuevas sesiones: ventana de riesgo de privilegios obsoletos.
  - Aplicar en caliente sin invalidar: complejiza consistencia de permisos en frontend/backend.

## Decision 5: Contrato de rol para frontend
- Decision: Incluir rol efectivo en respuesta de login y exponer endpoint de contexto de sesion (`/auth/me`) para sincronizar UI por permisos.
- Rationale: Frontend necesita fuente confiable para ocultar/mostrar acciones sin lógica inferida.
- Alternatives considered:
  - Deducir rol por errores 403: mala UX y acoplamiento accidental.
  - Persistir rol solo en frontend sin consulta backend: riesgo de desalineacion.

## Decision 6: Compatibilidad progresiva con auth existente
- Decision: Mantener esquema bearer actual y extender persistencia/autorizacion sin romper endpoints existentes; migrar datos para crear al menos un usuario Admin inicial.
- Rationale: Reduce riesgo de regresiones en flujo actual ya funcional.
- Alternatives considered:
  - Reescribir todo el modulo auth: costo alto y riesgo innecesario para esta iteracion.
  - Mantener estructura actual sin migracion de usuarios: no cumple requisito multiusuario.
