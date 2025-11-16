@echo off
cls
echo.
echo ========================================
echo   🚀 PUSH DESPUES DE PERMITIR SECRETO
echo ========================================
echo.
echo IMPORTANTE: Primero debes permitir el secreto en GitHub
echo.
echo 1. Ve a este enlace:
echo    https://github.com/Kosovo9/neilv1/security/secret-scanning/unblock-secret/35XuwFvNgj2G6Z03N0hSVBxRqy1
echo.
echo 2. Click en "Allow secret" (solo esta vez)
echo.
echo 3. Presiona cualquier tecla cuando hayas permitido el secreto...
echo.
pause
echo.
echo [1/2] Haciendo push a GitHub...
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
            if %ERRORLEVEL% EQU 0 (
                echo.
                echo ========================================
                echo   ✅ DEPLOY A VERCEL COMPLETADO!
                echo ========================================
            ) else (
                echo.
                echo [INFO] Para desplegar a Vercel manualmente:
                echo   1. Ve a https://vercel.com
                echo   2. Importa el repositorio: neilv1
                echo   3. Vercel detectará automáticamente la configuración
            )
        ) else (
            echo.
            echo [INFO] Vercel CLI no está instalado.
            echo.
            echo Para desplegar a Vercel:
            echo   1. Ve a https://vercel.com
            echo   2. Importa el repositorio: neilv1
            echo   3. Vercel detectará automáticamente la configuración
        )
    ) else (
        echo.
        echo Para desplegar a Vercel más tarde:
        echo   1. Ve a https://vercel.com
        echo   2. Importa el repositorio: neilv1
        echo   3. O ejecuta: vercel --prod
    )
) else (
    echo.
    echo [ERROR] No se pudo hacer push.
    echo.
    echo Verifica que:
    echo   1. Permitaste el secreto en GitHub
    echo   2. Estás autenticado: gh auth login
    echo   3. Tienes permisos en el repositorio
)

echo.
pause

