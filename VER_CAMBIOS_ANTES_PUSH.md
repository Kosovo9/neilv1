# 📋 Cómo Ver Cambios Antes de Push

## 🔍 Ver Cambios Actuales

### 1. Ver estado general
```bash
git status
```

### 2. Ver resumen de cambios
```bash
git diff --stat
```

### 3. Ver cambios detallados en un archivo
```bash
git diff src/components/Header.tsx
```

### 4. Ver todos los cambios lado a lado
```bash
git diff
```

### 5. Ver archivos nuevos (untracked)
```bash
git status --untracked-files=all
```

## 💾 Crear Backup "propro" Antes de Push

### Opción 1: Usar el script PowerShell (Recomendado)
```powershell
.\backup-propro.ps1
```

### Opción 2: Crear backup manualmente
```bash
# Crear branch de backup desde el commit actual
git branch propro-backup-$(date +%Y%m%d-%H%M%S) HEAD

# O con nombre fijo
git branch propro-backup HEAD
```

### Opción 3: Crear tag de backup
```bash
git tag propro-backup-$(date +%Y%m%d-%H%M%S)
```

## 📦 Ver Lista de Backups

```bash
# Ver branches de backup
git branch | grep propro

# Ver tags de backup
git tag | grep propro
```

## 🔄 Restaurar desde Backup

```bash
# Restaurar un branch de backup
git checkout propro-backup

# O crear nuevo branch desde backup
git checkout -b main-restored propro-backup
```

## ✅ Proceso Recomendado Antes de Push

1. **Ver cambios:**
   ```bash
   git status
   git diff --stat
   ```

2. **Crear backup:**
   ```powershell
   .\backup-propro.ps1
   ```

3. **Revisar cambios importantes:**
   ```bash
   git diff src/components/Header.tsx
   git diff src/components/Hero.tsx
   ```

4. **Si todo está bien, hacer commit y push:**
   ```bash
   git add .
   git commit -m "Descripción de cambios"
   git push origin main
   ```

## 🚨 Si algo sale mal

```bash
# Restaurar desde backup
git checkout propro-backup

# O descartar cambios locales
git restore .
git clean -fd
```

