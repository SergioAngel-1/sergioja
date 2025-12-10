# Admin Panel - Sergio Jáuregui

Panel de administración para gestionar el ecosistema SergioJA.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS + Preset compartido
- **Animaciones**: Framer Motion
- **Autenticación**: JWT + js-cookie
- **HTTP Client**: Axios
- **Formularios**: React Hook Form + Zod
- **Gráficos**: Recharts

## 📁 Estructura

```
admin/
├── app/                    # App Router (Next.js 14)
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Redirect automático
│   ├── login/             # Página de login
│   └── dashboard/         # Dashboard protegido
├── components/
│   ├── atoms/             # Componentes básicos
│   ├── molecules/         # Componentes compuestos
│   └── layouts/           # Layouts reutilizables
├── lib/
│   ├── contexts/          # React Contexts
│   ├── api-client.ts      # Cliente API
│   ├── logger.ts          # Sistema de logs
│   └── utils.ts           # Utilidades
└── public/                # Assets estáticos
```

## 🔐 Autenticación

El panel usa JWT para autenticación:

1. Login en `/login` con email/password
2. Backend retorna token JWT
3. Token se guarda en cookie segura (7 días)
4. Token se envía en header `Authorization: Bearer <token>`
5. Rutas protegidas verifican token en `AuthContext`

## 🎨 Tema Visual

- **Paleta**: Cyber theme (rojo/azul neón)
- **Fuentes**: Orbitron (títulos), Rajdhani (body)
- **Efectos**: Glow effects, animaciones fluidas
- **Dark Mode**: Activado por defecto

## 📡 API Endpoints (Pendientes en Backend)

```typescript
// Auth
POST /api/admin/auth/login

// Messages
GET  /api/admin/messages
GET  /api/admin/messages/:id
PUT  /api/admin/messages/:id/status
DEL  /api/admin/messages/:id

// Newsletter
GET  /api/admin/newsletter/subscribers
DEL  /api/admin/newsletter/subscribers/:id

// Analytics
GET  /api/admin/analytics/page-views
GET  /api/admin/analytics/project-views
```

## 🚀 Desarrollo

```bash
# Instalar dependencias
npm install

# Desarrollo local (puerto 3002)
npm run dev

# Build para producción
npm run build

# Iniciar producción
npm start
```

## 🔧 Variables de Entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3002
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=<recaptcha_key>
NEXT_PUBLIC_GTM_ID=<optional>
```

## 📦 Despliegue Docker

El proyecto incluye configuración para Docker:

1. Añadir servicio en `docker-compose.prod.yml`
2. Crear `Dockerfile` (similar a main/Portfolio)
3. Configurar Traefik para `admin.sergioja.com`
4. Variables de entorno en `.env.production`

## 🔒 Seguridad

- ✅ JWT con expiración
- ✅ Cookies seguras (httpOnly, secure, sameSite)
- ✅ Rutas protegidas con AuthContext
- ✅ robots.txt bloquea indexación
- ✅ Interceptor axios para 401
- ⚠️ Implementar refresh token (futuro)
- ⚠️ Rate limiting en backend

## 📝 Próximos Pasos

1. Crear endpoints de admin en backend
2. Implementar CRUD de proyectos
3. Implementar CRUD de skills
4. Dashboard con estadísticas reales
5. Sistema de notificaciones en tiempo real
6. Upload de imágenes
7. Editor Markdown para proyectos
8. Logs de actividad de admin

## 🤝 Integración con Shared

El admin usa el código compartido en `/shared`:
- `alertSystem.ts` - Sistema de notificaciones
- `tailwind-preset.ts` - Estilos compartidos
- `types.ts` - Interfaces TypeScript
- `seo/` - Utilidades SEO

## 📄 Licencia

MIT - Sergio Jáuregui © 2025
