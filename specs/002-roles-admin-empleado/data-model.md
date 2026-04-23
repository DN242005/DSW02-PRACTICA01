# Data Model: Roles Admin y Empleado

## Entidad: UsuarioAutenticable

### Campos
- `id` (bigserial, PK)
- `username` (varchar(100), unico, requerido)
- `passwordHash` (varchar(255), requerido)
- `role` (enum: `ADMIN`, `EMPLEADO`, requerido)
- `active` (boolean, requerido)
- `updatedAt` (timestamptz, requerido)

### Reglas
- Un usuario tiene exactamente un rol activo por vez.
- `username` es unico case-insensitive.
- Cambio de rol implica invalidacion inmediata de sesiones activas del usuario.

## Entidad: SesionAuth

### Campos
- `token` (varchar(128), PK)
- `userId` (FK a UsuarioAutenticable)
- `username` (copia de lectura)
- `active` (boolean)
- `createdAt` (timestamptz)
- `lastActivityAt` (timestamptz)
- `invalidatedAt` (timestamptz, nullable)
- `invalidationReason` (enum/string)

### Reglas
- Sesion valida requiere `active=true`, no expirada y usuario activo.
- Si rol de usuario cambia, todas sus sesiones pasan a inactivas con razon `ROLE_CHANGED`.

## Vista de acceso: PerfilEmpleadoPropio

### Campos visibles
- `clave`
- `nombre`
- `direccion`
- `telefono`
- `departamentoActual`

### Reglas
- Disponible solo para rol Empleado sobre su propio recurso.

## Vista de acceso: EmpleadoTerceroResumen

### Campos visibles
- `clave`
- `nombre`
- `departamentoActual`

### Reglas
- Disponible para rol Empleado al consultar otros empleados.
- Campos sensibles (`direccion`, `telefono`) no deben exponerse.

## Matriz de permisos

- `ADMIN`
  - Empleados: create/read/update/delete
  - Departamentos: create/read/update/delete
  - Asignaciones empleado-departamento: assign/reassign/remove/read
- `EMPLEADO`
  - Empleados: read propio (completo), read terceros (resumen)
  - Departamentos: read segun necesidades de UI (sin operaciones de escritura)
  - Asignaciones: sin permisos de escritura

## Transiciones de estado relevantes

### UsuarioAutenticable
- `ACTIVE` -> `ACTIVE` (cambio de rol)
  - Efecto obligatorio: invalidar sesiones activas
- `ACTIVE` -> `INACTIVE`
  - Efecto obligatorio: invalidar sesiones activas

### SesionAuth
- `ACTIVE` -> `INVALIDATED`
  - Causas: logout, expiracion, reemplazo por nuevo login, cambio de rol
