# 🚀 Instrucciones de Deployment - NeilV1 R2 CDN Worker

## ✅ Configuración Completada

Todos los archivos necesarios han sido creados:

- ✅ `wrangler.toml` - Configuración del worker
- ✅ `src/index.ts` - Código del worker CDN
- ✅ `package.json` - Dependencias
- ✅ `tsconfig.json` - Configuración TypeScript
- ✅ Scripts de deployment

## 📋 Pasos para Desplegar

### Opción 1: Usar Script Automático (Recomendado)

1. **Ejecuta SETUP.bat** (solo la primera vez):
   ```bash
   SETUP.bat
   ```
   Esto instalará todas las dependencias.

2. **Ejecuta DEPLOY.bat**:
   ```bash
   DEPLOY.bat
   ```
   Este script:
   - Verificará si estás autenticado
   - Te pedirá autenticarte si es necesario (abrirá tu navegador)
   - Desplegará el worker automáticamente

### Opción 2: Manual

1. **Instalar dependencias**:
   ```bash
   npm install
   npm install -g wrangler
   ```

2. **Autenticar con Cloudflare**:
   ```bash
   wrangler login
   ```
   Esto abrirá tu navegador para autenticarte.

3. **Desplegar**:
   ```bash
   wrangler deploy
   # o
   npm run deploy
   ```

## 🎯 Verificación

Después del deployment, verifica que funcione:

```bash
curl https://neilv1-r2-cdn.neocwolf.workers.dev/test-image.jpg
```

## 📝 Configuración Actual

- **Worker Name**: `neilv1-r2-cdn`
- **R2 Bucket**: `neilv1-ai-images`
- **Binding**: `R2_BUCKET`
- **CDN URL**: `https://neilv1-r2-cdn.neocwolf.workers.dev`

## 🔧 Uso en tu Aplicación

```typescript
// En tu código Next.js/React
const imageUrl = `https://neilv1-r2-cdn.neocwolf.workers.dev/${imagePath}`;

// Ejemplo:
const imageUrl = `https://neilv1-r2-cdn.neocwolf.workers.dev/uploads/user123/photo.jpg`;
```

## ⚠️ Notas Importantes

1. **Bucket R2**: Asegúrate de que el bucket `neilv1-ai-images` existe en tu cuenta de Cloudflare
2. **Permisos**: El worker necesita permisos de lectura en el bucket R2
3. **CORS**: Ya está configurado para permitir todos los orígenes (`*`)

## 🐛 Solución de Problemas

### Error: "Bucket not found"
- Verifica que el bucket `neilv1-ai-images` existe en Cloudflare Dashboard
- Verifica que el nombre en `wrangler.toml` es correcto

### Error: "Not authenticated"
- Ejecuta `wrangler login` nuevamente
- Verifica tu conexión a internet

### Error: "Permission denied"
- Verifica que tienes permisos para crear workers en tu cuenta de Cloudflare
- Verifica que el binding R2 está correctamente configurado

## ✅ Checklist Final

- [ ] Dependencias instaladas (`npm install`)
- [ ] Wrangler instalado globalmente
- [ ] Autenticado con Cloudflare (`wrangler login`)
- [ ] Bucket R2 creado (`neilv1-ai-images`)
- [ ] Worker desplegado (`wrangler deploy`)
- [ ] CDN funcionando (verificar con curl)

---

**¡Listo para desplegar!** 🚀

