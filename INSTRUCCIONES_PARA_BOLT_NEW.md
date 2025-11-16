# 🚀 INSTRUCCIONES COMPLETAS PARA BOLT.NEW

## 📋 CONTEXTO DEL PROYECTO

**Repositorio:** `https://github.com/Kosovo9/studio-nexorapro`  
**Framework:** React + TypeScript + Vite + Tailwind CSS  
**Estado:** Proyecto funcional, necesita completar tareas específicas

---

## ✅ TAREAS A COMPLETAR

### 1. **AGREGAR DISCLAIMER EN FOOTER (ES/EN)** 🔴 PRIORIDAD ALTA

**Ubicación:** `src/components/Footer.tsx`

**Qué hacer:**
- Agregar una nueva sección de disclaimer al final del footer
- El disclaimer debe aparecer en ambos idiomas (ES/EN) según el idioma seleccionado
- Debe incluir:
  - Responsabilidad del usuario sobre el uso de las fotos
  - Edad mínima: 18 años
  - Prohibido contenido pornográfico, racista, ilegal o inapropiado
  - Términos de uso y responsabilidad legal

**Estilo:**
- Texto pequeño, color gris claro
- Centrado o alineado según el diseño del footer
- Separado visualmente del resto del contenido

**Archivo de traducciones:** `src/lib/translations.ts`
- Agregar las traducciones en la sección `footer.disclaimer`

**Ejemplo de contenido:**
```
ES: "El usuario es responsable del uso de las fotos generadas. 
Debe ser mayor de 18 años. Prohibido contenido pornográfico, 
racista o ilegal."

EN: "User is responsible for the use of generated photos. 
Must be 18+ years old. Prohibited: pornographic, racist, 
or illegal content."
```

---

### 2. **ACTUALIZAR PORCENTAJES** 🔴 PRIORIDAD ALTA

#### 2.1. Afiliados: Cambiar a 40%

**Archivos a modificar:**
- `src/components/AffiliateSection.tsx` - Buscar "15%" o "15% OFF" y cambiar a "40%"
- `src/lib/translations.ts` - Buscar textos relacionados con afiliados y actualizar porcentajes
- Cualquier otro archivo que mencione el porcentaje de afiliados

**Qué buscar:**
- "15%"
- "15% OFF"
- "comisión"
- "affiliate"
- Textos que mencionen el porcentaje de descuento/comisión

#### 2.2. Referidos/Recomendados: Cambiar a 15%

**Archivos a modificar:**
- `src/components/ReferralSection.tsx` - Buscar porcentajes y cambiar a "15%"
- `src/lib/translations.ts` - Actualizar textos de referidos
- Cualquier otro archivo que mencione el porcentaje de referidos

**Qué buscar:**
- "10%"
- "20%"
- "referral"
- "referido"
- "recomendado"
- Textos que mencionen el porcentaje de descuento por referido

---

### 3. **VERIFICAR CARRUSELES DE FOTOS EN HERO** ✅ YA IMPLEMENTADO

**Ubicación:** `src/components/Hero.tsx`

**Estado actual:** Ya están implementados los carruseles:
- Lado izquierdo: Fotos de mujeres con transición vertical
- Lado derecho: Fotos de hombres con transición vertical

**Qué verificar:**
- Que los carruseles estén funcionando correctamente
- Que las transiciones sean suaves
- Que la opacidad sea adecuada (25-30%)
- Que solo se muestren en pantallas grandes (lg:block)

**Si no funcionan:**
- Revisar `src/components/AnimatedCarousel.tsx`
- Verificar que las imágenes se carguen correctamente
- Asegurar que las transiciones verticales funcionen

---

### 4. **ACTUALIZAR FONDOS DE LUGARES** ⏳ ESPERANDO IMÁGENES

**Secciones a actualizar:**
- `src/components/HowItWorks.tsx` - Fondo del transbordador espacial
- `src/components/Pricing.tsx` - Fondo de Torre Latinoamericana (México)
- `src/components/AffiliateSection.tsx` - Fondo de ciudad nocturna
- `src/components/ReferralSection.tsx` - Fondo de NYC

**Qué hacer:**
- El usuario proporcionará las imágenes
- Reemplazar las URLs de Pexels actuales por las nuevas imágenes
- Mantener los overlays y estilos existentes
- Asegurar que las imágenes se carguen correctamente

**Formato esperado:**
- Imágenes en formato JPG o PNG
- Alta resolución (1920x1080 o superior)
- Se subirán a la carpeta `public/` o se usarán URLs externas

---

### 5. **EXPANDIR SISTEMA DE PROMPTS** 📝 ESTRUCTURA LISTA

**Ubicación:** `src/lib/prompts/categories/`

**Estado actual:**
- ✅ Estructura creada y funcionando
- ✅ Archivos base con ejemplos
- ⏳ **FALTA:** Agregar los 400+ prompts completos

**Archivos a expandir:**
1. `men.ts` - Agregar más prompts para hombres
2. `women.ts` - Agregar más prompts para mujeres
3. `children.ts` - Agregar más prompts para niños y niñas
4. `pets.ts` - Agregar más prompts para perros y gatos
5. `families.ts` - Agregar más prompts navideños y familiares
6. `couples.ts` - Agregar más prompts para parejas
7. `teams.ts` - Agregar más prompts para equipos

**Formato de cada prompt:**
```typescript
{
  id: 'unique_id',
  uiLabel: 'Lo que el cliente ve en el UI (simple)',
  completePrompt: `Prompt completo de 200+ palabras con todas las especificaciones técnicas, iluminación, composición, color grading, etc.`,
  tags: ['tag1', 'tag2'],
  style: 'professional' // o 'casual', 'luxury', 'urban', 'nature'
}
```

**Ejemplos de prompts a agregar:**
- Cenas de navidad
- Cenas en familia
- Pareja en la chimenea
- En el arbolito
- Niños con Santa Claus
- Y muchos más...

**NOTA:** Esta tarea puede hacerse gradualmente. La estructura está lista.

---

## 🚫 RESTRICCIONES IMPORTANTES

### ❌ NO HACER:
- ❌ NO modificar la estructura del UI principal
- ❌ NO cambiar colores o estilos existentes (excepto porcentajes)
- ❌ NO romper funcionalidades existentes
- ❌ NO eliminar código existente
- ❌ NO cambiar la estructura de componentes principales

### ✅ SÍ HACER:
- ✅ Solo agregar contenido nuevo (disclaimer)
- ✅ Solo actualizar valores numéricos (porcentajes)
- ✅ Solo reemplazar URLs de imágenes (fondos)
- ✅ Solo agregar prompts a los archivos existentes
- ✅ Mantener responsive design
- ✅ Probar que todo compile: `npm run build`

---

## 📁 ARCHIVOS CLAVE A MODIFICAR

1. **`src/components/Footer.tsx`** - Agregar disclaimer
2. **`src/lib/translations.ts`** - Agregar textos del disclaimer y actualizar porcentajes
3. **`src/components/AffiliateSection.tsx`** - Cambiar 15% a 40%
4. **`src/components/ReferralSection.tsx`** - Cambiar a 15%
5. **`src/components/HowItWorks.tsx`** - Actualizar fondo (cuando el usuario proporcione imagen)
6. **`src/components/Pricing.tsx`** - Actualizar fondo (cuando el usuario proporcione imagen)
7. **`src/components/AffiliateSection.tsx`** - Actualizar fondo (cuando el usuario proporcione imagen)
8. **`src/components/ReferralSection.tsx`** - Actualizar fondo (cuando el usuario proporcione imagen)
9. **`src/lib/prompts/categories/*.ts`** - Agregar más prompts (opcional, puede hacerse después)

---

## ✅ CHECKLIST DE VERIFICACIÓN

Después de completar las tareas:

- [ ] Disclaimer agregado en Footer (ES/EN)
- [ ] Afiliados cambiado a 40% en todos los lugares
- [ ] Referidos cambiado a 15% en todos los lugares
- [ ] Carruseles de fotos funcionando en Hero
- [ ] Fondos actualizados (cuando el usuario proporcione imágenes)
- [ ] Build exitoso: `npm run build`
- [ ] No hay errores de TypeScript
- [ ] No hay errores de lint
- [ ] UI no se rompió
- [ ] Responsive funciona correctamente

---

## 🔧 COMANDOS ÚTILES

```bash
# Verificar que compile
npm run build

# Ver errores de TypeScript
npm run typecheck

# Ver errores de lint
npm run lint

# Iniciar servidor de desarrollo
npm run dev
```

---

## 📝 NOTAS TÉCNICAS

- El proyecto usa TypeScript estricto
- Tailwind CSS para estilos
- Sistema de traducciones en `src/lib/translations.ts`
- ErrorBoundary ya implementado
- Logging agregado en `src/main.tsx` para debugging

---

## 🎯 PRIORIDADES

1. **ALTA:** Disclaimer en Footer
2. **ALTA:** Actualizar porcentajes (40% afiliados, 15% referidos)
3. **MEDIA:** Verificar carruseles (ya deberían estar funcionando)
4. **BAJA:** Actualizar fondos (esperando imágenes del usuario)
5. **BAJA:** Expandir prompts (puede hacerse gradualmente)

---

## 📞 SI HAY DUDAS

- Revisar `src/lib/prompts/README.md` para entender el sistema de prompts
- Revisar `src/lib/translations.ts` para ver el formato de traducciones
- Revisar componentes existentes para mantener consistencia
- Probar cambios localmente antes de hacer commit

---

**¡Listo para trabajar! Sigue las restricciones y todo saldrá bien.** 🚀

