# NeilV1 R2 CDN Worker

Cloudflare Worker para servir imágenes desde R2 Bucket como CDN.

## 🚀 Configuración Rápida

### 1. Autenticar con Cloudflare

```bash
wrangler login
```

Esto abrirá tu navegador para autenticarte con Cloudflare.

### 2. Verificar configuración

El archivo `wrangler.toml` ya está configurado con:
- **Worker name**: `neilv1-r2-cdn`
- **R2 Bucket**: `neilv1-ai-images`
- **Binding**: `R2_BUCKET`

### 3. Desplegar

```bash
npm run deploy
# o
wrangler deploy
```

### 4. Verificar deployment

```bash
curl https://neilv1-r2-cdn.neocwolf.workers.dev/test-image.jpg
```

## 📁 Estructura

```
neilv1-r2-cdn/
├── src/
│   └── index.ts      # Código del worker
├── wrangler.toml     # Configuración de Cloudflare
├── package.json      # Dependencias
└── tsconfig.json     # Configuración TypeScript
```

## 🔧 Uso en la aplicación

```typescript
// En tu código Next.js/React
const imageUrl = `https://neilv1-r2-cdn.neocwolf.workers.dev/${imagePath}`;
```

## ✅ Características

- ✅ CORS habilitado para todos los orígenes
- ✅ Cache headers optimizados (1 año)
- ✅ Soporte para OPTIONS preflight
- ✅ Manejo de errores 404 y 500
- ✅ ETag support para cache validation

## 🎯 URL del CDN

**CDN URL**: `https://neilv1-r2-cdn.neocwolf.workers.dev`

