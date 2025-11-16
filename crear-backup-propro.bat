@echo off
echo ========================================
echo   CREAR BACKUP PROPRO
echo ========================================
echo.

for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set timestamp=%datetime:~0,8%-%datetime:~8,6%
set backup_name=propro-backup-%timestamp%

echo Creando backup: %backup_name%
git branch %backup_name% HEAD

if %errorlevel% equ 0 (
    echo.
    echo ✅ Backup creado exitosamente: %backup_name%
    echo.
    echo Para ver todos los backups:
    echo   git branch ^| findstr propro
    echo.
    echo Para restaurar este backup:
    echo   git checkout %backup_name%
) else (
    echo.
    echo ❌ Error al crear backup
)

echo.
pause

