@echo off
echo ========================================
echo   PUSH RAPIDO A GITHUB - neilv1
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
echo [1/3] Verificando repositorio...
gh repo view neilv1 >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    echo [OK] Repositorio neilv1 existe.
    echo.
    echo [2/3] Configurando remote...
    git remote remove origin 2>nul
    for /f "tokens=*" %%i in ('gh api user --jq .login') do set GITHUB_USER=%%i
    git remote add origin https://github.com/%GITHUB_USER%/neilv1.git
    echo [OK] Remote configurado: https://github.com/%GITHUB_USER%/neilv1.git
) else (
    echo [INFO] Creando nuevo repositorio neilv1...
    gh repo create neilv1 --public --source=. --remote=origin --push
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   ✅ PUSH COMPLETADO!
        echo ========================================
        echo.
        gh repo view neilv1 --web
        pause
        exit /b 0
    ) else (
        echo [ERROR] No se pudo crear el repositorio.
        pause
        exit /b 1
    )
)

echo.
echo [3/3] Haciendo push a GitHub...
git push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo   ✅ PUSH COMPLETADO!
    echo ========================================
    echo.
    echo Repositorio: https://github.com/%GITHUB_USER%/neilv1
    echo.
    gh repo view neilv1 --web
) else (
    echo.
    echo [ERROR] No se pudo hacer push.
    echo Verifica tus permisos y conexión.
)

echo.
pause

