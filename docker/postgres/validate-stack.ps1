#!/usr/bin/env pwsh
[CmdletBinding()]
param()

$ErrorActionPreference = 'Stop'

$composeFile = Join-Path $PSScriptRoot 'docker-compose.yml'

if (-not (Test-Path $composeFile)) {
    Write-Error "No se encontro docker-compose.yml en $PSScriptRoot"
    exit 1
}

docker compose version 2>$null | Out-Null
if ($LASTEXITCODE -ne 0) {
    Write-Error 'Docker Compose no esta disponible en este entorno.'
    exit 1
}

$configJson = docker compose -f $composeFile config --format json
if ($LASTEXITCODE -ne 0 -or [string]::IsNullOrWhiteSpace($configJson)) {
    Write-Error 'No se pudo obtener la configuracion de docker compose en formato JSON.'
    exit 1
}

$config = $configJson | ConvertFrom-Json
$services = $config.services
$serviceNames = @($services.PSObject.Properties.Name)

$required = @('database', 'backend', 'frontend', 'proxy')
$missing = $required | Where-Object { $_ -notin $serviceNames }
$extra = $serviceNames | Where-Object { $_ -notin $required }

$errors = @()

if ($serviceNames.Count -ne 4) {
    $errors += "Se esperaban exactamente 4 servicios y se encontraron $($serviceNames.Count)."
}

if ($missing.Count -gt 0) {
    $errors += "Faltan servicios requeridos: $($missing -join ', ')."
}

if ($extra.Count -gt 0) {
    $errors += "Servicios no contemplados en el stack de 4 roles: $($extra -join ', ')."
}

$roles = @{
    backend  = 'backend'
    frontend = 'frontend'
    database = 'database'
    proxy    = 'proxy'
}

$duplicatedRoleTargets = $roles.Values | Group-Object | Where-Object { $_.Count -gt 1 }
if ($duplicatedRoleTargets.Count -gt 0) {
    $errors += 'Hay roles mapeados al mismo servicio, la asignacion de roles debe ser unica.'
}

foreach ($serviceName in $serviceNames) {
    $svc = $services.$serviceName
    $hasHostPorts = $null -ne $svc.ports -and $svc.ports.Count -gt 0

    if ($serviceName -eq 'proxy' -and -not $hasHostPorts) {
        $errors += 'El servicio proxy debe publicar al menos un puerto al host.'
    }

    if ($serviceName -ne 'proxy' -and $hasHostPorts) {
        $errors += "El servicio $serviceName no debe publicar puertos al host."
    }
}

if ($errors.Count -gt 0) {
    Write-Host 'VALIDACION FALLIDA:' -ForegroundColor Red
    foreach ($e in $errors) {
        Write-Host " - $e" -ForegroundColor Red
    }
    exit 1
}

Write-Host 'VALIDACION EXITOSA: stack de 4 contenedores cumple reglas de roles y exposicion.' -ForegroundColor Green
exit 0
