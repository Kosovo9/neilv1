# 🚀 INICIO RÁPIDO - GitHub + Vercel

## ⚡ Push a GitHub (2 minutos)

### Paso 1: Autenticarse (solo la primera vez)
```bash
gh auth login
```
- Selecciona: GitHub.com
- Selecciona: HTTPS
- Autentica con tu navegador

### Paso 2: Push automático
```bash
cd "C:\StudioNexoraProPro-main (3)\StudioNexoraProPro-main"
PUSH_RAPIDO.bat
```

O manualmente:
```bash
gh repo create neilv1 --public --source=. --remote=origin --push
```

## 🎯 Deploy a Vercel (5 minutos)

### Opción 1: Desde GitHub (Recomendado)
1. Ve a https://vercel.com
2. Login con GitHub
3. Click "Add New Project"
4. Selecciona repositorio `neilv1`
5. Vercel detectará automáticamente la configuración
6. Agrega variables de entorno (VITE_*)
7. Click "Deploy"

### Opción 2: Vercel CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## ✅ Listo!

- **GitHub:** https://github.com/TU_USUARIO/neilv1
- **Vercel:** https://neilv1.vercel.app

## 📝 Variables de Entorno para Vercel

Configura estas en Vercel Dashboard:
```
VITE_CLERK_PUBLISHABLE_KEY
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_STRIPE_PUBLISHABLE_KEY
VITE_MERCADOPAGO_PUBLIC_KEY
VITE_APP_URL
```

---

**¿Problemas?** Revisa `DEPLOY_INSTRUCCIONES.md` para más detalles.

