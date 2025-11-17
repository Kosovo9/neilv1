@echo off
echo ==========================================
echo NEILV1 R2 CDN WORKER - SETUP INICIAL
echo ==========================================
echo.

echo [1/2] Instalando dependencias...
call npm install
if %errorlevel% neq 0 (
    echo [!] Error instalando dependencias
    pause
    exit /b 1
)

echo.
echo [2/2] Instalando Wrangler CLI globalmente...
call npm install -g wrangler
if %errorlevel% neq 0 (
    echo [!] Error instalando wrangler
    pause
    exit /b 1
)

echo.
echo ==========================================
echo ✅ SETUP COMPLETADO!
echo ==========================================
echo.
echo Proximos pasos:
echo 1. Ejecuta DEPLOY.bat para autenticarte y desplegar
echo 2. O ejecuta manualmente: wrangler login
echo.
pause

