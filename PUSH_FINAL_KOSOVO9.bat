@echo off
cls
echo.
echo ========================================
echo   🚀 PUSH FINAL A GITHUB - neilv1
echo   Usuario: Kosovo9
echo ========================================
echo.

REM Verificar autenticación
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [AUTENTICACION REQUERIDA]
    echo.
    echo Por favor, autentícate con GitHub:
    echo.
    gh auth login
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Autenticación fallida.
        pause
        exit /b 1
    )
)

echo.
echo [1/3] Verificando repositorio neilv1...
gh repo view Kosovo9/neilv1 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Repositorio neilv1 existe.
) else (
    echo [INFO] Creando repositorio neilv1...
    gh repo create Kosovo9/neilv1 --public --description "Studio Nexora Pro - Aplicación web profesional para generación de fotos con IA"
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] No se pudo crear el repositorio.
        pause
        exit /b 1
    )
    echo [OK] Repositorio creado exitosamente
)

echo.
echo [2/3] Configurando remote...
git remote remove origin 2>nul
git remote add origin https://github.com/Kosovo9/neilv1.git
git branch -M main
echo [OK] Remote configurado: https://github.com/Kosovo9/neilv1.git

echo.
echo [3/3] Haciendo push de todos los commits...
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ PUSH COMPLETADO EXITOSAMENTE!
    echo ========================================
    echo.
    echo Repositorio: https://github.com/Kosovo9/neilv1
    echo.
    start https://github.com/Kosovo9/neilv1
    echo.
    echo ¿Deseas desplegar a Vercel ahora? (S/N)
    set /p deploy_choice="> "
    
    if /i "%deploy_choice%"=="S" (
        echo.
        echo Desplegando a Vercel...
        where vercel >nul 2>&1
        if %ERRORLEVEL% EQU 0 (
            vercel --prod --yes
        ) else (
            echo [INFO] Vercel CLI no está instalado.
            echo.
            echo Para desplegar a Vercel:
            echo   1. Ve a https://vercel.com
            echo   2. Importa el repositorio: neilv1
            echo   3. Vercel detectará automáticamente la configuración
        )
    )
) else (
    echo.
    echo [ERROR] No se pudo hacer push.
    echo.
    echo Posibles causas:
    echo   - No estás autenticado: gh auth login
    echo   - El repositorio no existe: Crea neilv1 en GitHub
    echo   - Problemas de permisos
    echo.
    echo Intenta manualmente:
    echo   git push -u origin main
)

echo.
pause

