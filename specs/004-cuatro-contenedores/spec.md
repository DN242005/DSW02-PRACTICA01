# Feature Specification: Entorno con Cuatro Contenedores Separados

**Feature Branch**: `004-cuatro-contenedores`  
**Created**: 2026-04-12  
**Status**: Draft  
**Input**: User description: "debemos crear y/o tner cuatro contenedores uno para el backen , uno para el frontend, uno de la base de datos y por ultimo uno de proxy si faltan crealos pero deben se r4 por separado"

## Clarifications

### Session 2026-04-12

- Q: ¿Que contenedores pueden exponer puertos al host? -> A: Solo el proxy publica puerto al host; backend y base de datos quedan solo en red interna.
- Q: ¿Como debe recuperarse el entorno ante caida de un contenedor? -> A: Reinicio automatico solo del contenedor fallido, manteniendo los demas activos.
- Q: ¿Como debe manejarse la persistencia de datos en base de datos? -> A: Persistencia por defecto y limpieza solo por accion explicita del usuario.
- Q: ¿Cuando se considera que el entorno esta realmente listo? -> A: Cuando los 4 contenedores estan running y el flujo basico via proxy responde correctamente.
- Q: ¿Cual es el alcance operativo de esta feature? -> A: Solo local/desarrollo; sin requisitos de produccion en esta feature.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Levantar entorno completo (Priority: P1)

Como desarrollador, quiero iniciar el sistema con cuatro contenedores separados (backend, frontend, base de datos y proxy) para disponer de un entorno funcional y consistente.

**Why this priority**: Sin los cuatro contenedores en funcionamiento no existe un entorno usable para desarrollo ni validacion.

**Independent Test**: Se valida iniciando el entorno desde cero y verificando que existen exactamente cuatro contenedores activos, cada uno con su rol.

**Acceptance Scenarios**:

1. **Given** un repositorio limpio y prerrequisitos cumplidos, **When** el usuario inicia el entorno, **Then** el sistema levanta exactamente cuatro contenedores separados: backend, frontend, base de datos y proxy.
2. **Given** que el entorno esta levantado, **When** el usuario revisa el estado de los servicios, **Then** cada contenedor aparece en estado saludable o listo para operar.

---

### User Story 2 - Operar acceso por proxy (Priority: P2)

Como usuario del entorno local, quiero acceder a la aplicacion a traves del contenedor proxy para tener un punto unico de entrada.

**Why this priority**: El proxy ordena el acceso y evita exponer puntos de entrada inconsistentes.

**Independent Test**: Se valida accediendo al punto de entrada del proxy y comprobando que la interfaz y funcionalidades de negocio son alcanzables a traves de ese punto unico.

**Acceptance Scenarios**:

1. **Given** los cuatro contenedores activos, **When** el usuario accede al punto de entrada del proxy, **Then** puede cargar la interfaz frontend y consumir funcionalidades del backend sin acceder directamente a los servicios internos.
2. **Given** el proxy activo y algun servicio interno temporalmente no disponible, **When** el usuario realiza una solicitud, **Then** recibe una respuesta de error clara sin bloquear o colgar el sistema completo.

---

### User Story 3 - Completar componentes faltantes (Priority: P3)

Como mantenedor del proyecto, quiero que el entorno incluya cualquier contenedor faltante para cumplir siempre con la arquitectura de cuatro contenedores separados.

**Why this priority**: Asegura que el proyecto se mantenga completo y reproducible para cualquier integrante del equipo.

**Independent Test**: Se valida partiendo de una configuracion incompleta, aplicando la definicion de entorno y comprobando que se crean o incorporan los contenedores faltantes hasta alcanzar cuatro.

**Acceptance Scenarios**:

1. **Given** una configuracion sin uno o mas contenedores requeridos, **When** el mantenedor ejecuta el flujo de configuracion del entorno, **Then** los contenedores faltantes quedan definidos y operativos sin fusionar roles.
2. **Given** una configuracion con cuatro contenedores ya definidos, **When** se vuelve a ejecutar el flujo de configuracion, **Then** el resultado se mantiene estable sin duplicar ni eliminar contenedores validos.

### Edge Cases

- Inicio del entorno cuando un puerto necesario ya esta en uso.
- Inicio del entorno cuando la base de datos tarda en estar disponible.
- Ausencia de configuracion minima para uno de los cuatro roles requeridos.
- Reinicio de un solo contenedor fallido sin detener todo el entorno.
- Desajuste de conectividad entre proxy y servicios internos.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: El sistema MUST definir exactamente cuatro contenedores separados con estos roles: backend, frontend, base de datos y proxy.
- **FR-002**: El sistema MUST mantener separados los cuatro roles y MUST NOT combinar dos o mas roles en un mismo contenedor.
- **FR-003**: El sistema MUST permitir iniciar el entorno completo en una sola ejecucion operativa.
- **FR-004**: El sistema MUST permitir detener el entorno completo en una sola ejecucion operativa.
- **FR-005**: El sistema MUST verificar que los cuatro contenedores requeridos estan presentes y reportar cualquier faltante con mensaje accionable.
- **FR-006**: El sistema MUST crear o incorporar definiciones faltantes de contenedores requeridos para completar los cuatro roles.
- **FR-007**: El sistema MUST conservar los datos de la base de datos entre reinicios del entorno, salvo que el usuario solicite explicitamente limpieza.
- **FR-008**: El sistema MUST exponer un punto unico de entrada para usuarios a traves del contenedor proxy.
- **FR-009**: El sistema MUST permitir la comunicacion interna necesaria entre los cuatro contenedores para que el flujo de negocio funcione de extremo a extremo.
- **FR-010**: El sistema MUST publicar estado de ejecucion por contenedor para facilitar diagnostico de fallos.
- **FR-011**: El sistema MUST permitir reiniciar individualmente cualquier contenedor sin requerir recrear todo el entorno.
- **FR-012**: El sistema MUST incluir documentacion operativa para levantar, validar y detener el entorno de cuatro contenedores.
- **FR-013**: El sistema MUST permitir que solo el contenedor proxy exponga puertos al host.
- **FR-014**: El sistema MUST NOT exponer puertos de backend ni base de datos al host; ambos deben operar en red interna de contenedores.
- **FR-015**: El sistema MUST aplicar reinicio automatico al contenedor que falle sin reiniciar el resto de contenedores activos.
- **FR-016**: El sistema MUST NOT reiniciar todo el entorno como respuesta predeterminada a la falla de un solo contenedor.
- **FR-017**: El sistema MUST ofrecer una accion explicita de limpieza de datos para la base de datos, separada del flujo de inicio normal.
- **FR-018**: El sistema MUST considerar el entorno como listo solo cuando los cuatro contenedores esten activos y el flujo basico de uso responda correctamente a traves del proxy.
- **FR-019**: El sistema MUST limitar el alcance de esta feature al entorno local/de desarrollo.
- **FR-020**: El sistema MUST NOT exigir hardening de produccion (por ejemplo, TLS obligatorio, alta disponibilidad multi-nodo o politicas avanzadas de despliegue) dentro de esta feature.

### Key Entities *(include if feature involves data)*

- **Contenedor de Rol**: Unidad de ejecucion asociada a un rol unico (backend, frontend, base de datos o proxy), con estado y parametros de operacion.
- **Definicion de Entorno**: Conjunto de reglas de ejecucion que describen los cuatro contenedores, su relacion y su ciclo de vida.
- **Estado de Despliegue**: Resultado verificable del entorno en un momento dado, incluyendo presencia de los cuatro contenedores y su disponibilidad.

## Assumptions

- El equipo trabajara en un entorno local con capacidad para ejecutar cuatro contenedores simultaneamente.
- Los servicios de backend y frontend existentes del proyecto son reutilizables y solo requieren su contenedor dedicado.
- El proxy funcionara como punto de entrada principal para validacion funcional del entorno.
- Se considerara exito minimo cuando los cuatro contenedores esten activos y permitan un flujo basico de uso de la aplicacion.

## Out of Scope

- Requisitos de despliegue productivo como alta disponibilidad multi-nodo.
- Endurecimiento completo de seguridad de produccion mas alla de la separacion de red y puertos definida para desarrollo.
- Operacion en orquestadores avanzados de produccion.

## Dependencies

- Herramienta de contenedores instalada y operativa en el entorno de desarrollo.
- Disponibilidad de imagenes o artefactos necesarios para backend, frontend, base de datos y proxy.
- Configuracion de red local que permita exponer el punto de entrada del proxy.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: En 100% de ejecuciones validas del flujo de inicio, el entorno muestra exactamente cuatro contenedores activos (backend, frontend, base de datos y proxy).
- **SC-002**: Al menos 95% de inicios del entorno finaliza en menos de 5 minutos en equipos de desarrollo estandar del proyecto.
- **SC-003**: Al menos 90% de integrantes nuevos del equipo logra levantar y validar el entorno completo en menos de 15 minutos siguiendo la documentacion.
- **SC-004**: En 100% de pruebas de recuperacion de falla simple, el contenedor fallido se recupera automaticamente sin reiniciar todo el entorno.
- **SC-005**: En al menos 95% de ejecuciones de validacion, el criterio de "entorno listo" se cumple con cuatro contenedores activos y respuesta funcional del flujo basico via proxy.
