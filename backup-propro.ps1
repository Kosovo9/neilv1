# Script PowerShell para crear backup "propro" antes de hacer push
# Uso: .\backup-propro.ps1

Write-Host "🔄 Creando backup 'propro' antes de push..." -ForegroundColor Cyan

# Obtener el hash del commit actual
$currentCommit = git rev-parse HEAD
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupBranch = "propro-backup-$timestamp"

# Crear branch de backup desde el commit actual
git branch $backupBranch $currentCommit

Write-Host "✅ Backup creado: $backupBranch" -ForegroundColor Green
Write-Host "📋 Para ver todos los backups: git branch | Select-String propro" -ForegroundColor Yellow
Write-Host "📋 Para restaurar un backup: git checkout <nombre-backup>" -ForegroundColor Yellow

