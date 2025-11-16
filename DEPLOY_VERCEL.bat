@echo off
cls
echo.
echo ========================================
echo   🚀 DEPLOY A VERCEL - neilv1
echo ========================================
echo.
echo Repositorio: https://github.com/Kosovo9/neilv1
echo.

REM Verificar Vercel CLI
where vercel >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [INFO] Vercel CLI no está instalado.
    echo.
    echo Para instalar Vercel CLI:
    echo   npm install -g vercel
    echo.
    echo O despliega desde: https://vercel.com
    echo.
    echo Pasos manuales:
    echo   1. Ve a https://vercel.com
    echo   2. Login con GitHub
    echo   3. Click "Add New Project"
    echo   4. Selecciona repositorio: neilv1
    echo   5. Vercel detectará automáticamente (Vite + dist)
    echo   6. Agrega variables de entorno (VITE_*)
    echo   7. Click "Deploy"
    echo.
    pause
    exit /b 0
)

echo [OK] Vercel CLI instalado
echo.
echo ¿Deseas desplegar a producción? (S/N)
set /p deploy_choice="> "

if /i "%deploy_choice%"=="S" (
    echo.
    echo Desplegando a Vercel (producción)...
    vercel --prod --yes
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   ✅ DEPLOY A VERCEL COMPLETADO!
        echo ========================================
        echo.
        echo Tu aplicación está en producción!
    ) else (
        echo.
        echo [INFO] Deploy completado o cancelado.
        echo.
        echo Para ver el estado, ve a: https://vercel.com/dashboard
    )
) else (
    echo.
    echo Desplegando preview...
    vercel --yes
    
    if %ERRORLEVEL% EQU 0 (
        echo.
        echo ========================================
        echo   ✅ PREVIEW DEPLOY COMPLETADO!
        echo ========================================
    )
)

echo.
echo Para desplegar manualmente más tarde:
echo   npm run deploy:vercel
echo.
pause

