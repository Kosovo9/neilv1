# Studio Nexora Pro

Aplicación web profesional para generación de fotos con IA, sistema de pagos integrado, y gestión de usuarios.

## 🚀 Características

- ✨ Generación de fotos profesionales con IA
- 💳 Integración con múltiples pasarelas de pago (Stripe, Mercado Pago, Lemon Squeezy)
- 👤 Autenticación con Clerk
- 📊 Dashboard de usuarios y administradores
- 🔗 Sistema de referidos y afiliados
- 🌐 Soporte multiidioma (ES/EN)
- 📱 Diseño responsive y moderno
- ⚡ Optimizado para máximo rendimiento

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS
- **Autenticación**: Clerk
- **Base de Datos**: Supabase
- **Pagos**: Stripe, Mercado Pago, Lemon Squeezy
- **IA**: Google AI Studio, Replicate, Stability AI
- **Storage**: AWS S3 / Cloudflare R2

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Vista previa de producción
npm run preview
```

## 🔧 Configuración

1. Copia el archivo `.env.example` a `.env`
2. Configura las siguientes variables de entorno:

```env
# Clerk
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_key

# Supabase
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key

# Stripe
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key

# Mercado Pago
VITE_MERCADOPAGO_PUBLIC_KEY=your_mercadopago_key

# App URL
VITE_APP_URL=http://localhost:5173
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye para producción
- `npm run build:prod` - Construye en modo producción
- `npm run preview` - Vista previa de la build de producción
- `npm run lint` - Ejecuta el linter
- `npm run typecheck` - Verifica tipos de TypeScript
- `npm run deploy:cloudflare` - Despliega a Cloudflare Pages
- `npm run deploy:preview` - Despliega preview a Cloudflare

## 🏗️ Estructura del Proyecto

```
src/
├── api/              # Rutas API y webhooks
├── components/       # Componentes React
├── data/             # Datos estáticos y prompts
├── lib/              # Utilidades y servicios
│   ├── affiliates/   # Sistema de afiliados
│   ├── ai/           # Servicios de IA
│   ├── auth/         # Autenticación
│   ├── hooks/        # Custom hooks
│   ├── payments/     # Integración de pagos
│   ├── prompts/      # Gestión de prompts
│   ├── referrals/    # Sistema de referidos
│   ├── services/     # Servicios principales
│   └── utils/        # Utilidades
├── pages/            # Páginas de la aplicación
└── main.tsx          # Punto de entrada
```

## 🚀 Despliegue

### Vercel

El proyecto está configurado para desplegarse automáticamente en Vercel.

### Cloudflare Pages

```bash
npm run deploy:cloudflare
```

## 📄 Licencia

Privado - Todos los derechos reservados

## 👥 Contribución

Este es un proyecto privado. Para contribuciones, contacta al equipo de desarrollo.
# NeilV2
