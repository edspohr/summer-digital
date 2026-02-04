# Oasis Digital - Plataforma de Transformación Digital

Este proyecto es la plataforma digital para la Fundación Summer, diseñada para gestionar la experiencia de "Oasis Digital".

## 🏗 Arquitectura del Proyecto

El proyecto está construido utilizando tecnologías modernas de desarrollo web:

- **Frontend**: [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Componentes UI**: [Shadcn/ui](https://ui.shadcn.com/) (basado en Radix UI)
- **Iconos**: [Lucide React](https://lucide.dev/)
- **Estado Global**: [Zustand](https://zustand-demo.pmnd.rs/) (Gestión ligera de estado)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)

### Estructura de Carpetas

- `src/app`: Rutas y páginas de la aplicación (App Router).
- `src/components`: Componentes reutilizables (UI, Layouts).
- `src/features`: Módulos funcionales (CRM, Journey, Dashboard).
- `src/store`: Stores de Zustand para manejo de estado global.
- `src/lib`: Utilidades y configuraciones (ej. `utils.ts`, cliente Supabase).
- `src/types`: Definiciones de tipos TypeScript compartidos.

---

## 🚀 Cómo Iniciar

1.  **Instalar dependencias**:

    ```bash
    npm install
    ```

2.  **Correr servidor de desarrollo**:

    ```bash
    npm run dev
    ```

3.  **Abrir en el navegador**:
    Visita [http://localhost:3000](http://localhost:3000).

---

## 🔌 Conexión con Backend (Supabase)

Actualmente, la aplicación utiliza datos simulados ("mocks") en los servicios y stores. Para conectar con un backend real en Supabase, sigue esta lógica:

### 1. Configuración de Cliente

Crear un archivo `src/lib/supabase.ts`:

```typescript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### 2. Variables de Entorno

Renombrar `.env.example` a `.env.local` y agregar tus credenciales:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### 3. Migración de Servicios

Reemplazar la lógica en `src/services/*.service.ts`.

**Ejemplo Actual (Mock):**

```typescript
// journey.service.ts
export const getJourneys = async (): Promise<Journey[]> => {
  return MOCK_JOURNEYS; // Retorna array estático
};
```

**Ejemplo con Supabase:**

```typescript
// journey.service.ts
import { supabase } from "@/lib/supabase";

export const getJourneys = async (): Promise<Journey[]> => {
  const { data, error } = await supabase.from("journeys").select(`
            *,
            nodes (*)
        `);

  if (error) throw error;
  return data as Journey[];
};
```

### 4. Autenticación

Integrar el Auth de Supabase en `useAuthStore.ts` para reemplazar el login simulado.

---

## 🎨 Decisiones de Diseño

- **Paleta de Colores**: Slate (Grises neutros) y Teal (Acento principal), alineados con la identidad de Oasis.
- **Tipografía**: Geist Sans y Mono.
- **Experiencia de Usuario**: Enfoque en micro-interacciones y feedback visual (confetti al completar viajes, barras de progreso animadas).
