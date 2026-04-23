# Quickstart: Roles Admin y Empleado

## Prerrequisitos
- Docker + Docker Compose
- Backend y frontend levantados desde `dsw02-Prcatica01/docker/postgres`

## 1) Levantar entorno

```bash
cd dsw02-Prcatica01/docker/postgres
docker compose up -d
```

## 2) Preparar usuarios de prueba

- Usuario Admin: debe existir con rol `ADMIN`.
- Usuario Empleado: debe existir con rol `EMPLEADO`.

## 3) Validar flujo Admin (CRUD completo)

1. Iniciar sesion como Admin (`POST /auth/login`).
2. Ejecutar CRUD de empleados (`/api/empleados`).
3. Ejecutar CRUD de departamentos (`/api/departamentos`).
4. Asignar/remover empleado a departamento (`PUT/DELETE /api/empleados/{clave}/departamento`).
5. Confirmar respuestas exitosas para operaciones permitidas.

## 4) Validar flujo Empleado (solo lectura)

1. Iniciar sesion como Empleado (`POST /auth/login`).
2. Consultar perfil propio y validar campos completos.
3. Consultar otros empleados y validar que solo regresen `clave`, `nombre`, `departamentoActual`.
4. Intentar crear/editar/eliminar empleado o departamento y validar rechazo por permisos (`403`).

## 5) Validar invalidacion por cambio de rol

1. Iniciar sesion con un usuario y obtener token.
2. Cambiar rol del usuario por medio administrativo.
3. Reutilizar token anterior y validar rechazo (token invalido/no autorizado).
4. Iniciar sesion de nuevo y validar permisos del nuevo rol.

## 6) Validar frontend por rol

1. Login como Admin: UI debe mostrar acciones de gestion completa.
2. Login como Empleado: UI debe ocultar acciones de escritura y mostrar solo consultas permitidas.
3. Confirmar que la UI no expone telefono/direccion de terceros para rol Empleado.
