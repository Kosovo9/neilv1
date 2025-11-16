@echo off
echo ========================================
echo   DEPLOY COMPLETO: GitHub + Vercel
echo ========================================
echo.

REM Paso 1: Verificar autenticación GitHub
echo [1/4] Verificando autenticación de GitHub...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] No estás autenticado. Iniciando autenticación...
    echo.
    echo Por favor, sigue las instrucciones en pantalla para autenticarte.
    echo.
    gh auth login
    if %ERRORLEVEL% NEQ 0 (
        echo [ERROR] Error en la autenticación de GitHub.
        pause
        exit /b 1
    )
)

REM Paso 2: Crear repositorio y hacer push
echo.
echo [2/4] Creando repositorio neilv1 en GitHub...
gh repo create neilv1 --public --source=. --remote=origin --push 2>nul

if %ERRORLEVEL% EQU 0 (
    echo [OK] Repositorio creado y código subido exitosamente!
    echo.
    gh repo view neilv1 --web
) else (
    REM Verificar si el repo ya existe
    gh repo view neilv1 >nul 2>&1
    if %ERRORLEVEL% EQU 0 (
        echo [INFO] El repositorio neilv1 ya existe. Haciendo push...
        git remote remove origin 2>nul
        git remote add origin https://github.com/%USERNAME%/neilv1.git 2>nul
        git push -u origin main
        if %ERRORLEVEL% EQU 0 (
            echo [OK] Código actualizado exitosamente!
        ) else (
            echo [ERROR] No se pudo hacer push. Verifica tus permisos.
            pause
            exit /b 1
        )
    ) else (
        echo [ERROR] No se pudo crear el repositorio.
        echo Verifica que:
        echo   1. Estás autenticado: gh auth login
        echo   2. Tienes permisos para crear repositorios
        echo   3. El nombre neilv1 no está en uso
        echo.
        pause
        exit /b 1
    )
)

REM Paso 3: Verificar Vercel CLI
echo.
echo [3/4] Verificando Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Vercel CLI no está instalado.
    echo.
    echo Para instalar Vercel CLI, ejecuta:
    echo   npm install -g vercel
    echo.
    echo O despliega manualmente desde: https://vercel.com
    echo.
    echo El proyecto está listo para Vercel con la configuración en vercel.json
    pause
    exit /b 0
)

REM Paso 4: Desplegar a Vercel
echo.
echo [4/4] Desplegando a Vercel...
echo.
echo ¿Deseas desplegar ahora? (S/N)
set /p deploy_choice="> "

if /i "%deploy_choice%"=="S" (
    vercel --prod
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   ✅ DEPLOY COMPLETO!
        echo ========================================
        echo.
        echo GitHub: https://github.com/%USERNAME%/neilv1
        echo Vercel: Desplegado exitosamente
    ) else (
        echo [ERROR] Error en el despliegue a Vercel.
    )
) else (
    echo.
    echo Para desplegar manualmente a Vercel:
    echo   1. Ve a https://vercel.com
    echo   2. Importa el repositorio: neilv1
    echo   3. Vercel detectará automáticamente la configuración
    echo.
)

echo.
pause

