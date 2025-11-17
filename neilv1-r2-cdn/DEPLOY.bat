@echo off
echo ==========================================
echo NEILV1 R2 CDN WORKER - DEPLOYMENT
echo ==========================================
echo.

echo [1/3] Verificando autenticacion...
wrangler whoami
if %errorlevel% neq 0 (
    echo.
    echo [!] No estas autenticado con Cloudflare
    echo [!] Ejecutando wrangler login...
    echo [!] Se abrira tu navegador para autenticarte
    echo.
    wrangler login
    if %errorlevel% neq 0 (
        echo [!] Error en la autenticacion
        pause
        exit /b 1
    )
)

echo.
echo [2/3] Verificando configuracion...
if not exist "wrangler.toml" (
    echo [!] Error: wrangler.toml no encontrado
    pause
    exit /b 1
)

echo.
echo [3/3] Desplegando worker...
wrangler deploy

if %errorlevel% equ 0 (
    echo.
    echo ==========================================
    echo ✅ DEPLOYMENT EXITOSO!
    echo ==========================================
    echo.
    echo CDN URL: https://neilv1-r2-cdn.neocwolf.workers.dev
    echo.
    echo Para verificar:
    echo curl https://neilv1-r2-cdn.neocwolf.workers.dev/test-image.jpg
    echo.
) else (
    echo.
    echo [!] Error en el deployment
    echo [!] Revisa los mensajes de error arriba
    echo.
)

pause

