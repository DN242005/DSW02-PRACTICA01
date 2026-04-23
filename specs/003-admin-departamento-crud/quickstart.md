# Quickstart: CRUD de Departamentos para Administrador

## Prerrequisitos
- Docker Desktop activo
- Stack levantado (`postgres`, `empleado-service`, `frontend`)
- Usuario administrador valido

## 1) Levantar servicios

Desde `dsw02-Prcatica01/docker/postgres`:

```bash
docker compose up -d postgres empleado-service frontend
```

## 2) Login como administrador

```bash
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "admin",
    "contrasena": "admin123"
  }'
```

Guardar `token` de la respuesta.
Verificar tambien que `role` sea `ADMIN` para habilitar operaciones administrativas.

## 3) CRUD de departamentos

### Crear

```bash
curl -X POST http://localhost:8080/api/departamentos \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Finanzas",
    "descripcion": "Area financiera"
  }'
```

### Listar activos

```bash
curl http://localhost:8080/api/departamentos \
  -H "Authorization: Bearer <TOKEN>"
```

### Inactivar (baja logica)

```bash
curl -X DELETE http://localhost:8080/api/departamentos/{departamentoId} \
  -H "Authorization: Bearer <TOKEN>"
```

## 4) Mover empleado manualmente a departamento activo

```bash
curl -X PUT http://localhost:8080/api/empleados/EMP-1/departamento \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "departamentoId": 1
  }'
```

## 5) Desasignar empleado (sin departamento)

```bash
curl -X DELETE http://localhost:8080/api/empleados/EMP-1/departamento \
  -H "Authorization: Bearer <TOKEN>"
```

## 6) Validaciones esperadas
- 403 para usuario no administrador.
- 409 si hay conflicto concurrente de movimiento.
- 400/404 para departamento invalido o inexistente.
- Seccion administrativa de departamentos visible solo para rol ADMIN en frontend.

## 7) Flujo de validacion manual recomendado (orden sugerido)

1. Login con `admin/admin123` y guardar token.
2. Crear un departamento nuevo y confirmar respuesta `201`.
3. Listar departamentos sin query param y validar que solo aparezcan activos.
4. Editar el departamento creado y confirmar respuesta `200`.
5. Asignar `EMP-1` al departamento nuevo y confirmar respuesta `200`.
6. Desasignar `EMP-1` y confirmar respuesta `204`.
7. Inactivar el departamento sin empleados activos y confirmar respuesta `204`.
8. Listar sin `includeInactive` y validar que el departamento inactivo no aparezca.
9. Listar con `includeInactive=true` y validar que el departamento inactivo aparezca.
10. Repetir login con usuario `empleado/empleado123` e intentar POST/PUT/DELETE administrativos para validar `403`.

## 8) Criterios de salida

- CRUD de departamentos funcional para ADMIN.
- Movimiento y desasignacion manual funcional para ADMIN.
- Restricciones por rol comprobadas para usuario no ADMIN.
