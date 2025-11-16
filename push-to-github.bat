@echo off
echo ========================================
echo   Subiendo Studio Nexora Pro a GitHub
echo ========================================
echo.

REM Verificar si gh CLI está instalado
where gh >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] GitHub CLI no está instalado.
    echo Por favor instala GitHub CLI desde: https://cli.github.com/
    echo O sigue las instrucciones manuales en PUSH_TO_GITHUB.md
    pause
    exit /b 1
)

echo [1/3] Verificando autenticación de GitHub...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No estás autenticado. Iniciando autenticación...
    gh auth login
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Error en la autenticación.
        pause
        exit /b 1
    )
)

echo [2/3] Creando repositorio neilv1 en GitHub...
gh repo create neilv1 --public --source=. --remote=origin --push

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ ¡ÉXITO! Repositorio creado
    echo ========================================
    echo.
    echo El repositorio está disponible en:
    gh repo view neilv1 --web
) else (
    echo.
    echo [ERROR] No se pudo crear el repositorio.
    echo Verifica que:
    echo   1. Estás autenticado: gh auth login
    echo   2. El repositorio neilv1 no existe ya
    echo   3. Tienes permisos para crear repositorios
    echo.
    echo Alternativamente, sigue las instrucciones manuales en PUSH_TO_GITHUB.md
)

echo.
pause

