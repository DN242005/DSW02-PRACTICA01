# Stack local de 4 contenedores (Docker)

Este directorio ejecuta el entorno local con cuatro contenedores separados:

- `database` (base de datos, red interna)
- `backend` (backend, red interna)
- `frontend` (frontend, red interna)
- `proxy` (unico punto de entrada publicado al host)

## Configuracion

1. Copiar variables de ejemplo:

```bash
cp .env.example .env
```

2. Ajustar valores en `.env` solo si se necesita.

## Arranque

```bash
docker compose up -d --build
```

## Verificacion del stack

Ver servicios y salud:

```bash
docker compose ps
```

Validar reglas del stack (4 servicios, roles unicos, solo proxy expuesto):

```powershell
./validate-stack.ps1
```

Validar flujo basico via proxy:

```bash
curl -i http://localhost/actuator/health
curl -i http://localhost/swagger-ui/index.html
```

## Logs

```bash
docker compose logs -f
```

## Recuperacion de falla simple

Detener backend para simular falla y revisar reinicio por servicio:

```bash
docker compose stop backend
docker compose ps
```

## Detencion y limpieza

Detener stack (conservar datos):

```bash
docker compose down
```

Limpiar datos de PostgreSQL de forma explicita:

```bash
docker compose down -v
```

## Troubleshooting rapido

- Si el puerto `${PROXY_PORT}` esta ocupado, cambiar `PROXY_PORT` en `.env`.
- Si `validate-stack.ps1` falla por Docker no disponible, iniciar Docker Desktop/Engine e intentar nuevamente.
- Si backend queda `unhealthy`, revisar logs de `backend` y `database`.
