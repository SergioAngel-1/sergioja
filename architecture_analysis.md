# SergioJA Production Architecture Analysis

## 🏗️ Workspace Structure

**Monorepo:** `sergioja-monorepo` (Node.js 18+, npm workspaces)

```
sergioja/
├── backend/          # Express API + Prisma + PostgreSQL
├── Portfolio/        # Next.js 14 frontend (portfolio.sergioja.com)
├── main/             # Next.js 14 frontend (sergioja.com)
├── admin/            # Next.js 14 admin panel (admin.sergioja.com)
├── shared/           # Shared TypeScript utilities
├── traefik/          # Traefik dynamic configuration
├── letsencrypt/      # TLS certificates
└── docker-compose.prod.yml
```

---

## 🐳 Docker Production Services

### 1. **traefik** (Reverse Proxy)
- **Image:** `traefik:2.10.7`
- **Ports:** `80:80`, `443:443`
- **Configuration:**
  - File provider: [/traefik/dynamic.yml](file:///c:/Users/LENOVO/Documents/Proyectos/Sergioja/traefik/dynamic.yml) (not Docker labels)
  - Let's Encrypt: HTTP challenge, `acme.json` storage
  - Redirects HTTP → HTTPS
  - Dashboard: `traefik.sergioja.com` (BasicAuth protected)
- **Networks:** `sergioja-network`

### 2. **postgres** (Database)
- **Image:** `postgres:14-alpine`
- **Environment:** `DB_USER`, `DB_PASSWORD`, `DB_NAME` from [.env.production](file:///c:/Users/LENOVO/Documents/Proyectos/Sergioja/.env.production)
- **Volume:** `postgres_data:/var/lib/postgresql/data`
- **Health check:** `pg_isready` every 10s
- **Networks:** `sergioja-network`

### 3. **backend** (Express API)
- **Build:** [./backend/Dockerfile](file:///c:/Users/LENOVO/Documents/Proyectos/Sergioja/backend/Dockerfile)
- **Port:** Internal `5000`
- **External URL:** `https://api.sergioja.com`
- **Environment:**
  - `DATABASE_URL`: `postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}`
  - JWT secrets, reCAPTCHA, SMTP (Google Workspace), rate limiting
  - `FRONTEND_URLS`: Comma-separated origins
- **Dependencies:** Waits for `postgres` health check
- **Volume:** `./backend/logs:/app/logs`
- **Dockerfile highlights:**
  - Multi-stage build (builder + runner)
  - Copies `/shared` for type definitions
  - Runs `prisma generate` and `npx prisma db push` on startup
  - Health check: `/health` endpoint
- **Networks:** `sergioja-network`

### 4. **portfolio-frontend** (Next.js)
- **Build:** `./Portfolio/Dockerfile`
- **Port:** Internal `3000`
- **External URL:** `https://portfolio.sergioja.com`
- **Build Args/Env:**
  - `NEXT_PUBLIC_API_URL`: `${API_URL}` (from `.env.production`)
  - `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`, `NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_TWITTER_HANDLE`
- **Dependencies:** Depends on `backend`
- **Dockerfile highlights:**
  - Standalone output mode
  - Copies `/shared` for utilities (SEO, hooks, alerts)
  - Runs as non-root user `nextjs:nodejs`
- **Networks:** `sergioja-network`

### 5. **main-frontend** (Next.js)
- **Build:** `./main/Dockerfile`
- **Port:** Internal `3000`
- **External URL:** `https://sergioja.com`
- **Build Args/Env:** Same as portfolio + `NEXT_PUBLIC_SITE_URL: https://sergioja.com`
- **Dependencies:** Depends on `backend`
- **Networks:** `sergioja-network`

### 6. **admin-frontend** (Next.js)
- **Build:** `./admin/Dockerfile`
- **Port:** Internal `3000`
- **External URL:** `https://admin.sergioja.com`
- **Build Args/Env:** Same as others + `NEXT_PUBLIC_SITE_URL: https://admin.sergioja.com`
- **Dependencies:** Depends on `backend`
- **Networks:** `sergioja-network`

### 7. **docker-socket-proxy** (Security)
- **Image:** `tecnativa/docker-socket-proxy:latest`
- **Purpose:** Secure read-only access to Docker socket (for Traefik if needed)
- **Networks:** `sergioja-network`

---

## 🌐 Traefik Routing (`traefik/dynamic.yml`)

| **Subdomain** | **Service** | **Internal URL** | **Middlewares** | **TLS** |
|---------------|-------------|------------------|-----------------|---------|
| `sergioja.com` | main-frontend | `http://main-frontend:3000` | `main-redirect` (www→non-www) | Let's Encrypt |
| `portfolio.sergioja.com` | portfolio-frontend | `http://portfolio-frontend:3000` | `portfolio-redirect` (www→non-www) | Let's Encrypt |
| `admin.sergioja.com` | admin-frontend | `http://admin-frontend:3000` | - | Let's Encrypt |
| `api.sergioja.com` | backend | `http://backend:5000` | - | Let's Encrypt |
| `traefik.sergioja.com` | Traefik dashboard | `api@internal` | `auth` (BasicAuth) | Let's Encrypt |

**Middlewares:**
- `main-redirect` / `portfolio-redirect`: Permanent 301 redirects from `www.*` to non-www
- `auth`: BasicAuth with user `admin` (password hashed in config)

---

## 🔗 Service Communication Flows

### **Frontend → Backend API**
1. **User accesses:** `https://portfolio.sergioja.com`
2. **Traefik routes:** Request to `portfolio-frontend:3000`
3. **Next.js SSR/Client:** Makes API call to `NEXT_PUBLIC_API_URL` (injected as `https://api.sergioja.com` during build)
4. **Traefik routes:** API request (from client browser or SSR) to `backend:5000`
5. **Backend validates:**
   - CORS: Checks `Origin` header against `FRONTEND_URLS` + regex `/(^|\.)sergioja\.com$/`
   - Rate limiting: 100 req/15min (in production)
   - Authentication: JWT tokens (stored in HTTP-only cookies)
6. **Backend responds:** JSON data → Frontend renders

### **Internal Network**
- All services on `sergioja-network` (Docker bridge)
- Services communicate via container names (e.g., `backend:5000`, `postgres:5432`)
- No external exposure except through Traefik

---

## 📂 Shared Code (`shared/`)

**Purpose:** Reusable TypeScript utilities across frontends

| **File/Dir** | **Purpose** |
|--------------|-------------|
| `seo/` | SEO metadata, robots.txt, sitemap, structured data, web vitals |
| `hooks/` | `useAlerts`, `useLogger`, `usePageAnalytics`, `usePerformance` |
| `alertSystem.ts` | Toast/notification system |
| `analytics.ts` | Google Tag Manager integration |
| `formValidations.ts` | Zod schemas for forms |
| `recaptchaHelpers.ts` | reCAPTCHA Enterprise client helpers |
| `i18n/` | Internationalization utilities |
| `logger.ts` | Client-side logging |
| `performanceSystem.ts` | Performance monitoring |
| `tailwind-preset.ts` | Shared Tailwind config |
| `types.ts` | Shared TypeScript types |

**Integration:**
- Dockerfiles copy `/shared` into build context
- Symlinks `node_modules` during build (`ln -s /app/node_modules /shared/node_modules`)
- Imported as `import { ... } from '../../shared/...'` (NOT a workspace dependency)

---

## 🔐 Environment Variables (`.env.production`)

**Note:** File is gitignored. Critical keys (inferred from `docker-compose.prod.yml` and code):

| **Variable** | **Purpose** | **Used By** |
|--------------|-------------|-------------|
| `DB_USER`, `DB_PASSWORD`, `DB_NAME` | PostgreSQL credentials | postgres, backend |
| `API_URL` | Public backend URL (`https://api.sergioja.com`) | All frontends (as `NEXT_PUBLIC_API_URL`) |
| `JWT_SECRET`, `JWT_REFRESH_SECRET` | Authentication tokens | backend |
| `RECAPTCHA_ENTERPRISE_*` | Google reCAPTCHA Enterprise | backend |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | reCAPTCHA client key | All frontends |
| `SMTP_*` | Email via Google Workspace | backend (contact forms) |
| `NEXT_PUBLIC_GTM_ID` | Google Tag Manager | All frontends |
| `NEXT_PUBLIC_TWITTER_HANDLE` | Social metadata | Frontends |
| `FRONTEND_URLS` | CORS allowed origins | backend |

---

## 🛣️ Backend API Endpoints (`backend/src/server.ts`)

### **Admin Routes** (Protected - JWT required)
- `/api/admin/auth` - Login, logout, refresh tokens
- `/api/admin/dashboard` - Admin dashboard stats
- `/api/admin/messages` - Contact messages CRUD
- `/api/admin/projects` - Projects CRUD
- `/api/admin/categories` - Categories CRUD
- `/api/admin/cv` - CV/Resume CRUD
- `/api/admin/newsletter` - Newsletter management
- `/api/admin/analytics` - Analytics data

### **Portfolio Routes** (Public)
- `/api/portfolio/profile` - User profile
- `/api/portfolio/cv` - CV/resume data
- `/api/portfolio/projects` - Projects listing
- `/api/portfolio/skills` - Skills data
- `/api/portfolio/contact` - Contact form submission
- `/api/portfolio/newsletter` - Newsletter subscription
- `/api/portfolio/analytics` - Track page views
- `/api/categories` - Public categories listing

### **Health Checks**
- `/` - Health status
- `/health` - Health status (used by Docker healthcheck)

---

## 🔧 Key Technologies

| **Service** | **Stack** |
|-------------|-----------|
| **Backend** | Express 4, TypeScript 5, Prisma 5, PostgreSQL 14, bcrypt, JWT, Nodemailer, Winston (logging), Zod (validation) |
| **Frontends** | Next.js 14, React 18, TypeScript 5, Tailwind CSS, Framer Motion, Three.js (Portfolio/Main), Recharts (Admin), Axios |
| **Proxy** | Traefik 2.10.7 (file provider, Let's Encrypt HTTP challenge) |
| **Database** | PostgreSQL 14 (Alpine) |
| **Deployment** | Docker Compose, multi-stage Dockerfiles, standalone Next.js builds |

---

## 🚀 Deployment Architecture

```mermaid
graph TD
    A[Client Browser] -->|HTTPS| B[Traefik :443]
    B -->|TLS Termination| C{Routing}
    C -->|sergioja.com| D[main-frontend :3000]
    C -->|portfolio.sergioja.com| E[portfolio-frontend :3000]
    C -->|admin.sergioja.com| F[admin-frontend :3000]
    C -->|api.sergioja.com| G[backend :5000]
    D -->|API Calls| G
    E -->|API Calls| G
    F -->|API Calls| G
    G -->|Prisma| H[postgres :5432]
    I[Let's Encrypt] -->|ACME HTTP| B
    B -.->|Dashboard| J[traefik.sergioja.com]
```

---

## ⚡ Performance & Security Considerations

### **Production Optimizations**
1. **Traefik:**
   - HTTP → HTTPS redirect
   - TLS 1.2+ via Let's Encrypt
   - File provider (no Docker socket exposure to Traefik)
   
2. **Backend:**
   - Rate limiting: 100 req/15min per IP
   - Compression middleware
   - Helmet.js security headers
   - CORS restricted to `*.sergioja.com`
   - JWT with refresh tokens
   - PostgreSQL connection pooling via Prisma
   - Winston logging to `/app/logs`
   
3. **Frontends:**
   - Next.js standalone output (minimal Docker image)
   - Build-time env injection (`NEXT_PUBLIC_*`)
   - Non-root user execution
   - Static asset optimization
   
4. **Database:**
   - Health checks (10s interval)
   - Persistent volume (`postgres_data`)
   - TLS-ready (can enable `sslmode=require`)

### **Potential Performance Bottlenecks**
- **Prisma `db push` on every backend start:** Consider using migrations in production
- **No CDN for static assets:** Next.js images/static files served from containers
- **No horizontal scaling:** Single container per service (no load balancing beyond Traefik)
- **No caching layer:** No Redis for sessions, rate limiting, or API responses
- **Logs on local volume:** `/app/logs` not centralized (consider external logging)

---

## ✅ Architecture Confirmation

**Production Setup Validated:**
- ✅ Traefik proxy with TLS termination and subdomain routing
- ✅ Backend API with PostgreSQL, Prisma, JWT auth, CORS, rate limiting
- ✅ 3 Next.js frontends (main, portfolio, admin) with shared code
- ✅ Docker Compose orchestration with health checks and dependencies
- ✅ Environment variable injection (build-time for frontends, runtime for backend)
- ✅ Multi-stage Dockerfiles for optimized images
- ✅ Internal Docker network isolation
- ✅ Let's Encrypt automated TLS

**Ready for Post-Deployment Tasks:** Bug fixing, performance optimization, monitoring, scaling strategies.
