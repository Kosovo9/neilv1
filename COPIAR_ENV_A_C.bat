@echo off
echo.
echo ========================================
echo   Copiando neilv1.env a C:\
echo ========================================
echo.

REM Intentar copiar el archivo
copy /Y neilv1.env C:\neilv1.env >nul 2>&1

if %ERRORLEVEL% EQU 0 (
    echo [OK] Archivo copiado exitosamente a C:\neilv1.env
    echo.
    echo Ubicacion: C:\neilv1.env
) else (
    echo [ERROR] No se pudo copiar el archivo a C:\
    echo.
    echo Posibles causas:
    echo   - No tienes permisos de administrador
    echo   - El archivo esta en uso
    echo.
    echo Solucion:
    echo   1. Ejecuta este script como Administrador (Click derecho - Ejecutar como administrador)
    echo   2. O copia manualmente: neilv1.env a C:\neilv1.env
    echo.
    echo El archivo esta en: %CD%\neilv1.env
)

echo.
pause

