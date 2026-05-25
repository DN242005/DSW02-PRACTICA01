# Quickstart: Entorno con Cuatro Contenedores Separados

## Prerrequisitos
- Docker Engine instalado y operativo.
- Docker Compose v2 disponible.
- Puertos de host libres para el punto de entrada del proxy y utilidades locales.

## 1) Construir imagenes

Desde la raiz del repositorio:

```bash
cp docker/postgres/.env.example docker/postgres/.env
docker compose -f docker/postgres/docker-compose.yml build
```

## 2) Levantar el stack

```bash
docker compose -f docker/postgres/docker-compose.yml up -d
```

Resultado esperado:
- 4 contenedores separados activos: backend, frontend, database, proxy.
- Solo el proxy con puerto publicado al host.

## 3) Verificar estado por contenedor

```bash
docker compose -f docker/postgres/docker-compose.yml ps
```

Validar que:
- `database` reporta healthcheck exitoso.
- `backend` responde healthcheck de aplicacion.
- `frontend` y `proxy` estan operativos.

Validar reglas estructurales del stack:

```powershell
./docker/postgres/validate-stack.ps1
```

## 4) Validar flujo funcional via proxy

```bash
curl -i http://localhost/actuator/health
curl -i http://localhost/swagger-ui/index.html
```

Comportamiento esperado ante backend no disponible:

- Si `backend` cae, el proxy mantiene disponibilidad para frontend.
- Las rutas `/api/*`, `/auth/*`, `/swagger-ui/*` y `/v3/api-docs` deben responder error controlado (por ejemplo 502/503) sin caida total del stack.

Criterio de entorno listo:
- Los 4 contenedores activos.
- Flujo basico via proxy responde correctamente.

## 5) Simular recuperacion de falla simple

```bash
docker compose -f docker/postgres/docker-compose.yml stop backend
docker compose -f docker/postgres/docker-compose.yml ps
```

Validar que el contenedor fallido se recupera automaticamente sin reiniciar todo el stack.

Validar idempotencia de la verificacion:

```powershell
./docker/postgres/validate-stack.ps1
./docker/postgres/validate-stack.ps1
```

## 6) Limpieza explicita de datos (accion separada)

Solo cuando se necesite reiniciar datos de DB:

```bash
docker compose -f docker/postgres/docker-compose.yml down -v
```

Nota: el flujo de arranque normal no debe eliminar volumenes de datos.

## 7) Detener entorno

```bash
docker compose -f docker/postgres/docker-compose.yml down
```

## 8) Evidencia de validacion E2E

Ejecucion validada el 2026-04-13 en entorno local:

- `docker compose -f docker/postgres/docker-compose.yml config` OK.
- `docker compose -f docker/postgres/docker-compose.yml up -d --build` OK con 4 servicios levantados.
- `./docker/postgres/validate-stack.ps1` OK (`VALIDACION EXITOSA`).
- `curl -i http://localhost/healthz` retorno `HTTP/1.1 200 OK`.
- `curl -i http://localhost/actuator/health` via proxy retorno `{"status":"UP"}`.

Comando de limpieza usado para evitar contenedores huerfanos en pruebas iterativas:

```bash
docker compose -f docker/postgres/docker-compose.yml down --remove-orphans
```
