# API Routes Documentation

Documentación completa de todos los endpoints disponibles en la API.

## 📁 Estructura de Carpetas

```
routes/
├── admin/          # Endpoints de administración (requieren autenticación)
├── portfolio/      # Endpoints públicos del portfolio
└── shared/         # Endpoints compartidos entre admin y portfolio
```

---

## 🔐 Admin Routes

Todos los endpoints de admin requieren autenticación mediante JWT (excepto `/login`).

### Authentication (`/api/admin/auth`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/login` | Login de usuario admin | ❌ |
| POST | `/refresh` | Renovar access token | ❌ |
| POST | `/logout` | Cerrar sesión | ✅ |
| POST | `/logout-all` | Cerrar todas las sesiones | ✅ |
| POST | `/change-password` | Cambiar contraseña | ✅ |
| GET | `/me` | Obtener usuario actual | ✅ |

### Projects (`/api/admin/projects`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Obtener todos los proyectos (incluyendo borradores) | ✅ |
| POST | `/` | Crear nuevo proyecto | ✅ |
| PUT | `/:slug` | Actualizar proyecto existente | ✅ |
| DELETE | `/:slug` | Eliminar proyecto | ✅ |

**Query params GET:**
- `category` - Filtrar por categoría
- `featured` - Solo proyectos destacados (`true`)
- `page` - Número de página (default: 1)
- `limit` - Límite por página (default: 100)

### Dashboard (`/api/admin/dashboard`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/stats` | Obtener estadísticas del dashboard | ✅ |

### Messages (`/api/admin/messages`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Obtener todos los mensajes de contacto | ✅ |
| GET | `/:id` | Obtener mensaje específico | ✅ |
| PUT | `/:id` | Actualizar estado del mensaje | ✅ |
| DELETE | `/:id` | Eliminar mensaje | ✅ |

**Query params GET:**
- `status` - Filtrar por estado (`unread`, `read`, `archived`)
- `source` - Filtrar por origen (`contact_form`, `newsletter`)
- `limit` - Límite de resultados (default: 50)
- `offset` - Offset para paginación (default: 0)

### Categories (`/api/admin/categories`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/projects` | Obtener categorías de proyectos | ✅ |
| POST | `/projects` | Crear categoría de proyecto | ✅ |
| PUT | `/projects/:id` | Actualizar categoría de proyecto | ✅ |
| DELETE | `/projects/:id` | Eliminar categoría de proyecto | ✅ |
| GET | `/skills` | Obtener categorías de habilidades | ✅ |
| POST | `/skills` | Crear categoría de habilidad | ✅ |
| PUT | `/skills/:id` | Actualizar categoría de habilidad | ✅ |
| DELETE | `/skills/:id` | Eliminar categoría de habilidad | ✅ |

---

## 🌐 Portfolio Routes

Endpoints públicos para el portfolio (no requieren autenticación).

### Projects (`/api/portfolio/projects`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Obtener proyectos publicados con paginación | ❌ |
| GET | `/:slug` | Obtener proyecto individual por slug | ❌ |

**Query params GET:**
- `tech` - Filtrar por tecnología
- `category` - Filtrar por categoría
- `featured` - Solo proyectos destacados (`true`)
- `page` - Número de página (default: 1)
- `limit` - Límite por página (default: 10)

### Skills (`/api/portfolio/skills`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Obtener todas las habilidades | ❌ |
| GET | `/:name` | Obtener habilidad específica con proyectos relacionados | ❌ |

**Query params GET:**
- `category` - Filtrar por categoría

### Profile (`/api/portfolio/profile`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/` | Obtener información del perfil | ❌ |

### Contact (`/api/portfolio/contact`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/` | Enviar formulario de contacto | ❌ |

**Body params:**
- `name` - Nombre (requerido, max: 100)
- `email` - Email (requerido, válido)
- `subject` - Asunto (requerido, max: 200)
- `message` - Mensaje (requerido, max: 2000)
- `recaptchaToken` - Token de reCAPTCHA (requerido en producción)
- `recaptchaAction` - Acción de reCAPTCHA (default: 'submit_contact')

---

## 🔄 Shared Routes

Endpoints compartidos entre admin y portfolio.

### Analytics (`/api/portfolio/analytics` y `/api/admin/analytics`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/summary` | Obtener resumen de analíticas | ❌ |
| GET | `/page-views` | Obtener vistas de páginas | ✅ Admin |
| GET | `/project-views` | Obtener vistas de proyectos | ✅ Admin |

**Query params (admin endpoints):**
- `timeRange` - Rango de tiempo (`7d`, `30d`, `all`)
- `limit` - Límite de resultados (default: 100)
- `offset` - Offset para paginación (default: 0)

### Newsletter (`/api/portfolio/newsletter` y `/api/admin/newsletter`)

| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/subscribe` | Suscribirse al newsletter | ❌ |
| GET | `/subscribers` | Obtener todos los suscriptores | ✅ Admin |
| PUT | `/subscribers/:id` | Actualizar estado del suscriptor | ✅ Admin |
| DELETE | `/subscribers/:id` | Eliminar suscriptor | ✅ Admin |

**Body params POST `/subscribe`:**
- `email` - Email (requerido, válido)
- `recaptchaToken` - Token de reCAPTCHA (requerido en producción)
- `recaptchaAction` - Acción de reCAPTCHA (default: 'subscribe_newsletter')

**Query params GET `/subscribers`:**
- `status` - Filtrar por estado (`active`, `unsubscribed`)
- `limit` - Límite de resultados (default: 50)
- `offset` - Offset para paginación (default: 0)

---

## 🔑 Autenticación

Los endpoints que requieren autenticación esperan un JWT válido en las cookies:
- `accessToken` - Token de acceso (15 minutos de validez)
- `refreshToken` - Token de refresco (7 días de validez)

### Flujo de Autenticación

1. **Login**: `POST /api/admin/auth/login`
   - Enviar `email` y `password`
   - Recibir tokens en cookies HTTP-only

2. **Acceso a recursos**: Incluir cookies en cada request
   - El middleware `authMiddleware` valida el `accessToken`

3. **Renovar token**: `POST /api/admin/auth/refresh`
   - Enviar `refreshToken` en cookies
   - Recibir nuevo `accessToken`

4. **Logout**: `POST /api/admin/auth/logout`
   - Revocar tokens y limpiar cookies

---

## 📊 Respuestas de la API

Todas las respuestas siguen el formato `ApiResponse`:

### Respuesta Exitosa
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-12-10T14:30:00.000Z"
}
```

### Respuesta con Error
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Descripción del error",
    "details": { ... }
  },
  "timestamp": "2024-12-10T14:30:00.000Z"
}
```

### Respuesta Paginada
```json
{
  "success": true,
  "data": {
    "data": [ ... ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 50,
      "totalPages": 5
    }
  },
  "timestamp": "2024-12-10T14:30:00.000Z"
}
```

---

## 🛡️ Seguridad

### reCAPTCHA
Los siguientes endpoints requieren verificación de reCAPTCHA en producción:
- `POST /api/admin/auth/login`
- `POST /api/portfolio/contact`
- `POST /api/portfolio/newsletter/subscribe`

### Rate Limiting
- Login: 5 intentos cada 15 minutos

### CORS
Orígenes permitidos:
- `http://localhost:3000` (admin dev)
- `http://localhost:3001` (main dev)
- `http://localhost:3002` (portfolio dev)
- `*.sergioja.com` (producción)

---

## 📝 Notas

- Todos los timestamps están en formato ISO 8601 (UTC)
- Los slugs de proyectos son únicos y se generan automáticamente desde el título
- Las categorías son arrays de strings en los proyectos
- Las tecnologías incluyen información adicional: `category`, `proficiency`, `yearsOfExperience`
