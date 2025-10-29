# 🌐 Main Frontend - Sergio Jáuregui

Sitio web principal corporativo de Sergio Jáuregui.

## 🚀 Inicio Rápido

### 1. Instalar Dependencias

```bash
npm install
```

### 2. Configurar Variables de Entorno

```bash
# Copiar archivo de ejemplo
copy .env.local.example .env.local  # Windows
# cp .env.local.example .env.local  # macOS/Linux

# Main - Sitio Principal

Página principal de Sergio Jáuregui con diseño cyberpunk invertido (fondo blanco) y cara 3D interactiva.

## 🎨 Características

- **Diseño Cyberpunk Invertido**: Paleta de colores sobre fondo blanco
- **Cara 3D Interactiva**: Modelo 3D que sigue el movimiento del mouse usando Three.js
- **Sin Scroll**: Diseño de tablero completo en viewport
- **Animaciones Fluidas**: Transiciones y efectos con Framer Motion
- **Metodología Atómica**: Componentes organizados en atoms, molecules, organisms

## 🛠️ Tecnologías

- **Next.js 14** - Framework React con App Router
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones
- **Three.js** - Gráficos 3D
- **React Three Fiber** - React renderer para Three.js
- **React Three Drei** - Helpers para R3F

## 📦 Instalación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build
npm start
```

El sitio estará disponible en `http://localhost:3001`

## 📁 Estructura del Proyecto

```
main/
├── app/
│   ├── globals.css          # Estilos globales con Tailwind
│   ├── layout.tsx           # Layout principal
│   └── page.tsx             # Página de inicio
├── components/
│   ├── 3d/
│   │   └── Face3D.tsx       # Componente de cara 3D interactiva
│   └── atoms/
│       └── CyberCorner.tsx  # Esquinas decorativas cyberpunk
├── lib/
│   └── utils.ts             # Utilidades y helpers
├── public/                  # Archivos estáticos
├── tailwind.config.ts       # Configuración Tailwind
├── tsconfig.json           # Configuración TypeScript
└── package.json            # Dependencias

│   │   ├── ServicesSection.tsx
│   │   ├── AboutSection.tsx
│   │   └── CTASection.tsx
│   └── ui/                  # Componentes UI reutilizables
├── lib/                     # Utilidades y helpers
│   └── api-client.ts       # Cliente API compartido
└── public/                  # Archivos estáticos
```

## 🎨 Tecnologías

- **Framework**: Next.js 14 (App Router)
- **UI**: React 18
- **Estilos**: Tailwind CSS
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React
- **TypeScript**: 5.3+
- **Backend**: API compartida en `/backend`

## 🔗 Integración con Backend

Este frontend consume el backend compartido ubicado en `../backend`.

**Endpoints utilizados**:
- `/api/main/*` - Endpoints específicos del sitio principal
- `/api/shared/contact` - Formulario de contacto compartido

## 🌐 URLs

- **Desarrollo**: http://localhost:3001
- **Producción**: https://www.sergioja.com

## 📝 Páginas Disponibles

- `/` - Inicio
- `/servicios` - Servicios ofrecidos
- `/blog` - Blog técnico
- `/contacto` - Formulario de contacto
- `/privacidad` - Política de privacidad
- `/terminos` - Términos y condiciones

## 🎯 Características

- ✅ Diseño responsive y moderno
- ✅ Animaciones fluidas con Framer Motion
- ✅ SEO optimizado
- ✅ Rendimiento optimizado (Lighthouse 95+)
- ✅ Accesibilidad (WCAG 2.1 AA)
- ✅ Integración con backend compartido
- ✅ Formulario de contacto funcional

## 🚀 Despliegue

### Desarrollo Local

```bash
npm run dev
```

### Build de Producción

```bash
npm run build
npm start
```

### Docker

```bash
docker build -t main-frontend .
docker run -p 3001:3000 main-frontend
```

## 🔧 Scripts Disponibles

```bash
npm run dev          # Desarrollo (puerto 3001)
npm run build        # Build de producción
npm run start        # Servidor de producción
npm run lint         # Linter
npm run type-check   # Verificar tipos TypeScript
```

## 📚 Recursos

- [Documentación de Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)

---

**Desarrollado por Sergio Jáuregui** | [Portfolio](https://portfolio.sergioja.com)
