# Phase 0 Research: Entorno con Cuatro Contenedores Separados

## Decision 1: Topologia fija de cuatro servicios
- Decision: Definir una topologia fija con cuatro servicios de compose: backend, frontend, postgres y proxy.
- Rationale: Cumple FR-001/FR-002 y evita ambiguedad de despliegue por entorno.
- Alternatives considered:
  - Tres servicios combinando frontend+proxy: viola separacion de roles.
  - Cinco o mas servicios: agrega complejidad fuera de alcance.

## Decision 2: Exposicion de red solo por proxy
- Decision: Publicar puerto al host unicamente para proxy y mantener backend/postgres en red interna; frontend sin publicacion directa.
- Rationale: Cumple FR-013/FR-014 y centraliza el punto de entrada.
- Alternatives considered:
  - Exponer backend tambien: aumenta superficie de acceso y rompe criterio de borde unico.
  - Exponer todos los servicios: contradice requisitos del spec.

## Decision 3: Separar frontend de proxy
- Decision: Mantener frontend como contenedor independiente y agregar un contenedor proxy dedicado que enrute UI y API.
- Rationale: Cumple FR-001 y permite evolucionar reglas de borde sin tocar imagen frontend.
- Alternatives considered:
  - Reusar nginx del frontend como proxy: fusiona responsabilidades.
  - Servir frontend desde backend: rompe modularidad fullstack.

## Decision 4: Readiness por estado + flujo funcional
- Decision: Considerar entorno listo cuando los 4 contenedores esten activos y el flujo basico via proxy responda correctamente.
- Rationale: Cumple FR-018 y evita falsos positivos de readiness basados solo en proceso activo.
- Alternatives considered:
  - Readiness solo por estado running: no valida integracion real.
  - Readiness solo por healthchecks internos: no valida camino de usuario.

## Decision 5: Recuperacion ante fallos
- Decision: Aplicar politica de auto-restart al contenedor fallido sin reinicio global del stack.
- Rationale: Cumple FR-015/FR-016 y reduce impacto de fallas aisladas.
- Alternatives considered:
  - Recuperacion manual: mayor tiempo de indisponibilidad.
  - Reinicio total del stack: innecesario para fallas parciales.

## Decision 6: Persistencia de datos y limpieza explicita
- Decision: Mantener volumen persistente para postgres por defecto y separar un comando/accion explicita de limpieza.
- Rationale: Cumple FR-007/FR-017 y protege datos de desarrollo.
- Alternatives considered:
  - Limpieza automatica en cada arranque: riesgo alto de perdida accidental.
  - Sin opcion de limpieza: dificulta pruebas repetibles.

## Decision 7: Dependencias de arranque y healthchecks
- Decision: Usar depends_on con condiciones de salud para postgres y backend, mas checks HTTP para backend/proxy.
- Rationale: Reduce errores de carrera en arranque y facilita diagnostico de FR-010.
- Alternatives considered:
  - Solo orden de arranque sin healthcheck: fallas intermitentes por servicios aun no listos.
  - Esperas por tiempo fijo: fragil y dependiente de hardware.

## Decision 8: Contrato operativo del stack
- Decision: Definir contrato de infraestructura en YAML bajo contracts/container-stack.yaml con roles, puertos, conectividad y criterios de readiness.
- Rationale: Provee especificacion verificable para tareas y validacion del feature.
- Alternatives considered:
  - Solo descripcion narrativa en README: menor trazabilidad y validacion automatizable.
  - Contrato ad-hoc sin estructura: dificulta revisiones y mantenimiento.
