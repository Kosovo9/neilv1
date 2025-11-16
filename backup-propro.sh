#!/bin/bash
# Script para crear backup "propro" antes de hacer push
# Uso: ./backup-propro.sh

echo "🔄 Creando backup 'propro' antes de push..."

# Obtener el hash del commit actual
CURRENT_COMMIT=$(git rev-parse HEAD)
BACKUP_BRANCH="propro-backup-$(date +%Y%m%d-%H%M%S)"

# Crear branch de backup desde el commit actual
git branch "$BACKUP_BRANCH" "$CURRENT_COMMIT"

echo "✅ Backup creado: $BACKUP_BRANCH"
echo "📋 Para ver todos los backups: git branch | grep propro"
echo "📋 Para restaurar un backup: git checkout <nombre-backup>"

