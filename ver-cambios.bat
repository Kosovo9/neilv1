@echo off
echo ========================================
echo   VER CAMBIOS ANTES DE PUSH
echo ========================================
echo.

echo [1] Estado general:
git status
echo.

echo [2] Resumen de cambios:
git diff --stat
echo.

echo [3] Archivos modificados:
git diff --name-only
echo.

echo [4] Archivos nuevos (sin trackear):
git status --untracked-files=all --short
echo.

echo ========================================
echo Para ver cambios detallados de un archivo:
echo   git diff src/components/Header.tsx
echo ========================================
pause

