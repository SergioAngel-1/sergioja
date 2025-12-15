# 🚀 Guía de Despliegue - SergioJA Ecosystem (DESARROLLO LOCAL)

## Requisitos Previos

- Docker y Docker Compose instalados
- Archivo `.env` configurado en la raíz del proyecto
- PostgreSQL corriendo en Docker

---

## 📦 DESPLIEGUE INICIAL (Primera vez)

### Paso 1: Iniciar Base de Datos

```bash
docker compose --env-file .env -f docker-compose.yml up -d postgres
```

### Paso 2: Generar y Aplicar Migraciones de Prisma

```bash
# Generar migración inicial
cd backend
npx prisma migrate dev --name init

# Generar cliente de Prisma
npx prisma generate

# (Opcional) Seed de datos iniciales
npm run db:seed
cd ..
```

### Paso 3: Iniciar Backend (API)

```bash
docker compose --env-file .env -f docker-compose.yml up -d --build backend
```

### Paso 4: Iniciar Frontends

```bash
# Main (sergioja.com)
docker compose --env-file .env -f docker-compose.yml up -d --build main-frontend

# Portfolio (portfolio.sergioja.com)
docker compose --env-file .env -f docker-compose.yml up -d --build portfolio-frontend

# Admin (admin.sergioja.com)
docker compose --env-file .env -f docker-compose.yml up -d --build admin-frontend
```

### Paso 5: Crear Usuario Admin

```bash
docker compose --env-file .env -f docker-compose.yml exec backend npx tsx scripts/create-admin.ts
```

---

## 🔄 ACTUALIZACIÓN DE CÓDIGO (Cambios posteriores)

### Caso A: Cambios en Backend SIN migraciones de Prisma

```bash
# Rebuild y reiniciar solo backend
docker compose --env-file .env -f docker-compose.yml up -d --build backend
```

### Caso B: Cambios en Backend CON migraciones de Prisma

```bash
# 1. Generar nueva migración
cd backend
npx prisma migrate dev --name nombre_descriptivo
cd ..

# 2. Rebuild backend (la migración se aplicará automáticamente al iniciar)
docker compose --env-file .env -f docker-compose.yml up -d --build backend

# 3. Verificar que la migración se aplicó
docker compose --env-file .env -f docker-compose.yml logs backend | grep "migration"
```

### Caso C: Cambios en Frontends

```bash
# Main
docker compose --env-file .env -f docker-compose.yml up -d --build main-frontend

# Portfolio
docker compose --env-file .env -f docker-compose.yml up -d --build portfolio-frontend

# Admin
docker compose --env-file .env -f docker-compose.yml up -d --build admin-frontend
```

### Caso D: Cambios en Shared (tipos compartidos)

```bash
# Rebuild backend y todos los frontends
docker compose --env-file .env -f docker-compose.yml up -d --build backend
docker compose --env-file .env -f docker-compose.yml up -d --build main-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build portfolio-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build admin-frontend
```

### Caso E: Actualización completa (todos los servicios)

```bash
docker compose --env-file .env -f docker-compose.yml up -d --build
```

---

## 🛠️ COMANDOS DE GESTIÓN

### Ver logs de un servicio

```bash
docker compose --env-file .env -f docker-compose.yml logs -f [servicio]
```

**Ejemplos:**
```bash
docker compose --env-file .env -f docker-compose.yml logs -f postgres
docker compose --env-file .env -f docker-compose.yml logs -f backend
docker compose --env-file .env -f docker-compose.yml logs -f main-frontend
docker compose --env-file .env -f docker-compose.yml logs -f portfolio-frontend
docker compose --env-file .env -f docker-compose.yml logs -f admin-frontend
```

### Reiniciar un servicio

```bash
docker compose --env-file .env -f docker-compose.yml restart [servicio]
```

### Detener servicios

```bash
# Detener todos
docker compose --env-file .env -f docker-compose.yml down

# Detener uno específico
docker compose --env-file .env -f docker-compose.yml stop [servicio]
```

### Ver estado de los servicios

```bash
docker compose --env-file .env -f docker-compose.yml ps
```

### Acceder a shell de un contenedor

```bash
# Backend
docker compose --env-file .env -f docker-compose.yml exec backend sh

# PostgreSQL
docker compose --env-file .env -f docker-compose.yml exec postgres psql -U $DB_USER -d $DB_NAME
```

---

## ⚙️ GESTIÓN DE MIGRACIONES DE PRISMA

### Ver estado de migraciones

```bash
cd backend
npx prisma migrate status
```

### Crear nueva migración

```bash
cd backend
npx prisma migrate dev --name descripcion_del_cambio
```

### Aplicar migraciones pendientes

```bash
# En desarrollo (con prompt)
cd backend
npx prisma migrate dev

# En contenedor (automático al iniciar)
docker compose --env-file .env -f docker-compose.yml restart backend
```

### Reset de base de datos (⚠️ CUIDADO: Elimina todos los datos)

```bash
cd backend
npx prisma migrate reset
```

---

## 🔍 VARIABLES DE ENTORNO IMPORTANTES

### Para Desarrollo Local (.env)

```bash
# Base de datos
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/sergioja?schema=public
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=sergioja

# API (localhost para desarrollo)
API_URL=http://localhost:5000

# Frontends permitidos para CORS
FRONTEND_URLS=http://localhost:3000,http://localhost:3001,http://localhost:3002

# JWT Secrets (generar con: openssl rand -base64 32)
JWT_SECRET=tu_jwt_secret_minimo_32_caracteres
JWT_REFRESH_SECRET=tu_refresh_secret_minimo_32_caracteres

# reCAPTCHA (opcional en desarrollo)
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
RECAPTCHA_SITE_KEY=6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI
```

---

## ✅ VERIFICACIÓN POST-DESPLIEGUE

### 1. Verificar servicios corriendo

```bash
docker compose --env-file .env -f docker-compose.yml ps
```

### 2. Health checks

```bash
# Backend
curl http://localhost:5000/health

# PostgreSQL
docker compose --env-file .env -f docker-compose.yml exec postgres pg_isready -U $DB_USER
```

### 3. Acceder a las aplicaciones

- **Backend API**: http://localhost:5000
- **Main Frontend**: http://localhost:3000
- **Portfolio Frontend**: http://localhost:3001
- **Admin Panel**: http://localhost:3002

### 4. Verificar logs

```bash
# Ver logs de todos los servicios
docker compose --env-file .env -f docker-compose.yml logs -f

# Ver solo errores
docker compose --env-file .env -f docker-compose.yml logs | grep -i error
```

---

## 🐛 TROUBLESHOOTING

### Problema: Backend no inicia

```bash
# Ver logs detallados
docker compose --env-file .env -f docker-compose.yml logs backend

# Verificar conexión a PostgreSQL
docker compose --env-file .env -f docker-compose.yml exec backend npx prisma db pull

# Verificar variables de entorno
docker compose --env-file .env -f docker-compose.yml exec backend printenv | grep DATABASE_URL
```

### Problema: Migraciones no se aplican

```bash
# Ver estado de migraciones
cd backend
npx prisma migrate status

# Forzar aplicación de migraciones
docker compose --env-file .env -f docker-compose.yml exec backend npx prisma migrate deploy
```

### Problema: Frontend no conecta con backend

```bash
# Verificar que API_URL esté correcta en .env
cat .env | grep API_URL

# Verificar CORS en backend
docker compose --env-file .env -f docker-compose.yml logs backend | grep CORS
```

### Limpiar contenedores y volúmenes

```bash
# Detener y eliminar contenedores
docker compose --env-file .env -f docker-compose.yml down

# Eliminar también volúmenes (⚠️ ELIMINA LA BASE DE DATOS)
docker compose --env-file .env -f docker-compose.yml down -v
```

### Verificar configuración cargada

```bash
docker compose --env-file .env -f docker-compose.yml config
```

---

## 🔄 RESET COMPLETO (Empezar desde cero)

⚠️ **ADVERTENCIA**: Esto eliminará todos los contenedores, imágenes y datos.

### Opción A: Reset completo (incluye base de datos)

```bash
# 1. Detener y eliminar todo
docker compose --env-file .env -f docker-compose.yml down --rmi all --volumes --remove-orphans

# 2. Limpieza profunda de Docker
docker image prune -a -f
docker volume prune -f
docker network prune -f
docker builder prune -a -f

# 3. Seguir pasos de "DESPLIEGUE INICIAL" desde el principio
```

### Opción B: Reset conservando base de datos

```bash
# 1. Detener y eliminar contenedores e imágenes (conservar volúmenes)
docker compose --env-file .env -f docker-compose.yml down --rmi all --remove-orphans

# 2. Limpieza (sin volúmenes)
docker image prune -a -f
docker network prune -f
docker builder prune -a -f

# 3. Rebuild y reiniciar servicios
docker compose --env-file .env -f docker-compose.yml up -d --build
```

---

## 💾 BACKUP Y RESTORE

### Backup de base de datos

```bash
# Backup completo
docker compose --env-file .env -f docker-compose.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_$(date +%F_%H-%M-%S).sql

# Backup comprimido
docker compose --env-file .env -f docker-compose.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > backup_$(date +%F_%H-%M-%S).sql.gz
```

### Restore de base de datos

```bash
# Desde archivo SQL
docker compose --env-file .env -f docker-compose.yml exec -T postgres psql -U $DB_USER $DB_NAME < backup_2024-12-15.sql

# Desde archivo comprimido
gunzip -c backup_2024-12-15.sql.gz | docker compose --env-file .env -f docker-compose.yml exec -T postgres psql -U $DB_USER $DB_NAME
```

---

## 📝 NOTAS IMPORTANTES

### Optimizaciones implementadas (Fase 1)

✅ **Connection Pool**: Configuración automática de pool de conexiones en producción  
✅ **Startup Optimizado**: Migraciones solo se aplican si hay cambios pendientes  
✅ **Índices Optimizados**: Índice compuesto para cleanup de tokens  
✅ **Queries Optimizadas**: Skills query usa `select` en lugar de cargar proyectos completos  

### Flujo de migraciones

1. **Desarrollo**: `npx prisma migrate dev` genera y aplica migraciones
2. **Contenedor**: Al iniciar, verifica estado con `prisma migrate status`
3. **Deploy condicional**: Solo ejecuta `prisma migrate deploy` si hay cambios
4. **Sin downtime**: Migraciones se aplican antes de iniciar el servidor

### Comandos útiles

```bash
# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver uso de recursos
docker stats

# Limpiar todo Docker (⚠️ CUIDADO)
docker system prune -a --volumes
```
