# Variables de Entorno para Pagos - StudioNexoraProPro

## Variables Requeridas en Vercel

### Stripe
```
STRIPE_SECRET_KEY=sk_live_... (o sk_test_... para desarrollo)
STRIPE_WEBHOOK_SECRET=whsec_... (opcional, para webhooks)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_... (o pk_test_...)
VITE_STRIPE_PUBLIC_KEY=pk_live_... (o pk_test_...)
```

### Lemon Squeezy
```
LEMON_SQUEEZY_API_KEY=your_api_key_here
LEMON_SQUEEZY_STORE_ID=your_store_id_here
LEMON_SQUEEZY_WEBHOOK_SECRET=your_webhook_secret (opcional)
VITE_LEMONSQUEEZY_API_KEY=your_api_key_here
VITE_LEMONSQUEEZY_STORE_ID=your_store_id_here
```

### Mercado Pago
```
MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
VITE_MERCADOPAGO_ACCESS_TOKEN=your_access_token_here
```

### URLs y Configuración
```
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
VITE_APP_URL=https://your-domain.vercel.app
```

### Supabase (para webhooks)
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key (para webhooks de Mercado Pago)
```

## Instalación de Dependencias

Para que los endpoints de API funcionen correctamente, necesitas instalar el paquete de Stripe:

```bash
npm install stripe
```

## Configuración en Vercel

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega todas las variables listadas arriba
4. Asegúrate de que estén configuradas para Production, Preview y Development según corresponda

## Notas Importantes

- **Stripe**: Usa `STRIPE_SECRET_KEY` en los serverless functions (backend) y `VITE_STRIPE_PUBLIC_KEY` en el frontend
- **Lemon Squeezy**: Las variables con prefijo `VITE_` son para el frontend, las sin prefijo para el backend
- **Mercado Pago**: El monto está fijo en 1 MXN para pruebas. Cambiar en `api/create-mercado-session.ts` línea donde dice `const amount = 1;`
- **Webhooks**: Configura las URLs de webhook en cada plataforma de pago apuntando a:
  - Mercado Pago: `https://your-domain.vercel.app/api/webhooks/mercado`
  - Stripe: Configurar en dashboard de Stripe
  - Lemon Squeezy: Configurar en dashboard de Lemon Squeezy

