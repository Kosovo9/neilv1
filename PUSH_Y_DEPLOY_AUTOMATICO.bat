@echo off
setlocal enabledelayedexpansion

echo ========================================
echo   🚀 PUSH Y DEPLOY AUTOMATICO 10X
echo ========================================
echo.

REM Colores (si está disponible)
set "GREEN=[92m"
set "RED=[91m"
set "YELLOW=[93m"
set "RESET=[0m"

REM Paso 1: Verificar y autenticar GitHub
echo [1/5] Verificando GitHub CLI...
gh auth status >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo %YELLOW%[AUTENTICACION REQUERIDA]%RESET%
    echo.
    echo Por favor, autentícate con GitHub:
    echo.
    gh auth login --web
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[ERROR] Autenticación fallida.%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%[OK] Autenticado en GitHub%RESET%
) else (
    echo %GREEN%[OK] Ya estás autenticado en GitHub%RESET%
)

REM Paso 2: Obtener usuario de GitHub
echo.
echo [2/5] Obteniendo información de GitHub...
for /f "tokens=*" %%i in ('gh api user --jq .login 2^>nul') do set GITHUB_USER=%%i
if "%GITHUB_USER%"=="" (
    echo %RED%[ERROR] No se pudo obtener el usuario de GitHub.%RESET%
    pause
    exit /b 1
)
echo %GREEN%[OK] Usuario: %GITHUB_USER%%RESET%

REM Paso 3: Verificar/Crear repositorio
echo.
echo [3/5] Verificando repositorio neilv1...
gh repo view neilv1 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo %GREEN%[OK] Repositorio neilv1 existe.%RESET%
    echo.
    echo [INFO] Configurando remote...
    git remote remove origin 2>nul
    git remote add origin https://github.com/%GITHUB_USER%/neilv1.git
) else (
    echo [INFO] Creando nuevo repositorio neilv1...
    gh repo create neilv1 --public --description "Studio Nexora Pro - Aplicación web profesional para generación de fotos con IA" --source=. --remote=origin
    if %ERRORLEVEL% NEQ 0 (
        echo %RED%[ERROR] No se pudo crear el repositorio.%RESET%
        pause
        exit /b 1
    )
    echo %GREEN%[OK] Repositorio creado exitosamente%RESET%
)

REM Paso 4: Push a GitHub
echo.
echo [4/5] Haciendo push a GitHub...
git branch -M main 2>nul
git push -u origin main --force

if %ERRORLEVEL% EQU 0 (
    echo %GREEN%[OK] Push completado exitosamente!%RESET%
    echo.
    echo Repositorio: https://github.com/%GITHUB_USER%/neilv1
    echo.
    start https://github.com/%GITHUB_USER%/neilv1
) else (
    echo %RED%[ERROR] No se pudo hacer push.%RESET%
    echo.
    echo Intenta manualmente:
    echo   git push -u origin main
    pause
    exit /b 1
)

REM Paso 5: Verificar Vercel CLI
echo.
echo [5/5] Verificando Vercel CLI...
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo %YELLOW%[INFO] Vercel CLI no está instalado.%RESET%
    echo.
    echo Para instalar Vercel CLI:
    echo   npm install -g vercel
    echo.
    echo O despliega desde: https://vercel.com
    echo.
    echo %GREEN%✅ PUSH A GITHUB COMPLETADO!%RESET%
    echo.
    echo Próximos pasos:
    echo   1. Ve a https://vercel.com
    echo   2. Importa el repositorio: neilv1
    echo   3. Vercel detectará automáticamente la configuración
    echo   4. Agrega variables de entorno
    echo   5. Deploy!
    echo.
    pause
    exit /b 0
)

REM Vercel está instalado, ofrecer deploy
echo %GREEN%[OK] Vercel CLI instalado%RESET%
echo.
echo ¿Deseas desplegar a Vercel ahora? (S/N)
set /p deploy_choice="> "

if /i "!deploy_choice!"=="S" (
    echo.
    echo Desplegando a Vercel...
    vercel --prod --yes
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo %GREEN%========================================%RESET%
        echo   %GREEN%✅ DEPLOY COMPLETO!%RESET%
        echo %GREEN%========================================%RESET%
        echo.
        echo GitHub: https://github.com/%GITHUB_USER%/neilv1
        echo Vercel: Desplegado exitosamente
    ) else (
        echo %YELLOW%[INFO] Deploy a Vercel cancelado o con errores.%RESET%
        echo Puedes desplegar manualmente desde https://vercel.com
    )
) else (
    echo.
    echo %GREEN%✅ PUSH A GITHUB COMPLETADO!%RESET%
    echo.
    echo Para desplegar a Vercel más tarde:
    echo   1. Ve a https://vercel.com
    echo   2. Importa el repositorio: neilv1
    echo   3. O ejecuta: vercel --prod
)

echo.
pause

