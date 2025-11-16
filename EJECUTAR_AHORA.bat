@echo off
cls
echo.
echo ========================================
echo   ⚡ EJECUTA ESTO PARA PUSH AUTOMATICO
echo ========================================
echo.
echo Este script hará:
echo   1. Autenticarte en GitHub (si es necesario)
echo   2. Crear repositorio neilv1
echo   3. Push de todo el código
echo   4. Opción de deploy a Vercel
echo.
pause
echo.
call PUSH_Y_DEPLOY_AUTOMATICO.bat

