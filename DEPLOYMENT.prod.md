# 🚀 Guía de Despliegue - SergioJA Ecosystem (PRODUCCIÓN)

## Requisitos Previos

- Docker y Docker Compose instalados
- Archivo `.env.production` configurado en la raíz del proyecto
- Dominio configurado con DNS apuntando al servidor (A records)
- Puerto 80 y 443 abiertos en firewall
- Certificados SSL (Traefik los genera automáticamente con Let's Encrypt)

---

## 📦 DESPLIEGUE INICIAL (Primera vez en producción)

### Paso 1: Verificar configuración de DNS

```bash
# Verificar que los dominios apuntan al servidor
dig sergioja.com +short
dig api.sergioja.com +short
dig portfolio.sergioja.com +short
dig admin.sergioja.com +short
dig traefik.sergioja.com +short
```

### Paso 2: Iniciar Traefik (Proxy Reverso)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d traefik

# Verificar que Traefik está corriendo
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik
```

### Paso 3: Iniciar Base de Datos

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d postgres

# Esperar a que PostgreSQL esté listo
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_isready -U $DB_USER
```

### Paso 4: Generar y Aplicar Migraciones de Prisma

```bash
# Generar migración inicial (solo primera vez)
cd backend
npx prisma migrate dev --name init

# Generar cliente de Prisma
npx prisma generate

# (Opcional) Seed de datos iniciales
npm run db:seed
cd ..
```

### Paso 5: Iniciar Backend (API)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend

# Verificar logs
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
```

### Paso 6: Iniciar Frontends

```bash
# Main (sergioja.com)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build main-frontend

# Portfolio (portfolio.sergioja.com)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build portfolio-frontend

# Admin (admin.sergioja.com)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build admin-frontend
```

### Paso 7: Crear Usuario Admin

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx tsx scripts/create-admin.ts
```

### Paso 8: Verificar certificados SSL

```bash
# Esperar 1-2 minutos para que Let's Encrypt genere los certificados
# Verificar logs de Traefik
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep -i certificate
```

---

## 🔄 ACTUALIZACIÓN DE CÓDIGO (Cambios posteriores)

### Caso A: Cambios en Backend SIN migraciones de Prisma

```bash
# Rebuild y reiniciar solo backend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend

# Verificar logs
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
```

### Caso B: Cambios en Backend CON migraciones de Prisma

```bash
# 1. Generar nueva migración en desarrollo primero
cd backend
npx prisma migrate dev --name nombre_descriptivo
cd ..

# 2. Hacer backup de la base de datos
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_pre_migration_$(date +%F_%H-%M-%S).sql

# 3. Rebuild backend (la migración se aplicará automáticamente al iniciar)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend

# 4. Verificar que la migración se aplicó correctamente
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend | grep "migration"

# 5. Verificar que el backend responde
curl https://api.sergioja.com/health
```

### Caso C: Cambios en Frontends

```bash
# Main
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build main-frontend

# Portfolio
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build portfolio-frontend

# Admin
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build admin-frontend

# Verificar que los sitios cargan
curl -I https://sergioja.com
curl -I https://portfolio.sergioja.com
curl -I https://admin.sergioja.com
```

### Caso D: Cambios en Shared (tipos compartidos)

```bash
# Rebuild backend y todos los frontends
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build main-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build portfolio-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build admin-frontend
```

### Caso E: Actualización completa (todos los servicios)

```bash
# Hacer backup primero
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_full_$(date +%F_%H-%M-%S).sql

# Rebuild todos los servicios
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ COMANDOS DE GESTIÓN

### Ver logs de un servicio

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f [servicio]
```

**Ejemplos:**
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f traefik
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f postgres
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f main-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f portfolio-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f admin-frontend
```

### Reiniciar un servicio (sin rebuild)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml restart [servicio]
```

### Detener servicios

```bash
# Detener todos (mantiene volúmenes)
docker compose --env-file .env.production -f docker-compose.prod.yml down

# Detener uno específico
docker compose --env-file .env.production -f docker-compose.prod.yml stop [servicio]
```

### Ver estado de los servicios

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

### Acceder a shell de un contenedor

```bash
# Backend
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend sh

# PostgreSQL
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres psql -U $DB_USER -d $DB_NAME
```

### Ver uso de recursos

```bash
# Uso de CPU, memoria, red
docker stats

# Espacio en disco
docker system df
```

---

## ⚙️ GESTIÓN DE MIGRACIONES DE PRISMA

### Ver estado de migraciones

```bash
cd backend
npx prisma migrate status
```

### Crear nueva migración (en desarrollo primero)

```bash
cd backend
npx prisma migrate dev --name descripcion_del_cambio
```

### Aplicar migraciones pendientes en producción

```bash
# Automático: al reiniciar el backend, se aplican automáticamente
docker compose --env-file .env.production -f docker-compose.prod.yml restart backend

# Manual: forzar aplicación
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

### Verificar schema de producción

```bash
cd backend
npx prisma db pull
```

---

## 🔍 VARIABLES DE ENTORNO IMPORTANTES

### Para Producción (.env.production)

⚠️ **CRÍTICO**: Estas variables DEBEN estar configuradas correctamente:

```bash
# Base de datos (PostgreSQL en Docker)
DATABASE_URL=postgresql://postgres:TU_PASSWORD_SEGURO@postgres:5432/sergioja?schema=public
DB_USER=postgres
DB_PASSWORD=TU_PASSWORD_SEGURO
DB_NAME=sergioja

# API - DEBE apuntar al dominio público, NO a localhost
API_URL=https://api.sergioja.com

# Frontends permitidos para CORS (incluir www y sin www)
FRONTEND_URLS=https://sergioja.com,https://portfolio.sergioja.com,https://admin.sergioja.com,https://www.sergioja.com,https://www.portfolio.sergioja.com

# JWT Secrets - GENERAR NUEVOS EN PRODUCCIÓN (openssl rand -base64 32)
JWT_SECRET=tu_jwt_secret_produccion_minimo_32_caracteres
JWT_REFRESH_SECRET=tu_refresh_secret_produccion_minimo_32_caracteres

# SMTP (Google Workspace o similar)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=contact@sergioja.com
SMTP_PASS=tu_app_password
SMTP_FROM=contact@sergioja.com
SMTP_FROM_NAME=Sergio Jáuregui

# reCAPTCHA Enterprise
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_real
RECAPTCHA_SITE_KEY=tu_site_key_real
RECAPTCHA_ENTERPRISE_PROJECT_ID=tu_project_id
RECAPTCHA_ENTERPRISE_SERVICE_ACCOUNT='{"type":"service_account",...}'

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

**⚠️ IMPORTANTE**: 
- Si `API_URL` apunta a `localhost`, los frontends NO funcionarán
- Los JWT secrets DEBEN ser diferentes a desarrollo
- El password de PostgreSQL DEBE ser seguro en producción

---

## ✅ VERIFICACIÓN POST-DESPLIEGUE

### 1. Verificar servicios corriendo

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

### 2. Health checks

```bash
# Backend
curl https://api.sergioja.com/health

# PostgreSQL
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_isready -U $DB_USER
```

### 3. Verificar certificados SSL

```bash
# Ver certificados generados
docker compose --env-file .env.production -f docker-compose.prod.yml exec traefik ls -la /letsencrypt/acme.json

# Verificar SSL con curl
curl -vI https://sergioja.com 2>&1 | grep -i "SSL certificate"
```

### 4. Acceder a las aplicaciones

- **Traefik Dashboard**: https://traefik.sergioja.com (BasicAuth protegido)
- **Backend API**: https://api.sergioja.com/health
- **Main Frontend**: https://sergioja.com
- **Portfolio Frontend**: https://portfolio.sergioja.com
- **Admin Panel**: https://admin.sergioja.com

### 5. Verificar logs en busca de errores

```bash
# Ver logs de todos los servicios
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f

# Ver solo errores
docker compose --env-file .env.production -f docker-compose.prod.yml logs | grep -i error

# Ver logs de Traefik (routing)
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep -i "router\|certificate"
```

### 6. Verificar redirecciones www → non-www

```bash
curl -I https://www.sergioja.com
curl -I https://www.portfolio.sergioja.com
# Deben redirigir 301 a versiones sin www
```

---

## 🐛 TROUBLESHOOTING

### Problema: Certificados SSL no se generan

```bash
# Ver logs de Traefik
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep -i "acme\|certificate\|letsencrypt"

# Verificar que los puertos 80 y 443 están abiertos
sudo netstat -tulpn | grep -E ':(80|443)'

# Verificar DNS
dig sergioja.com +short

# Eliminar certificados y regenerar
docker compose --env-file .env.production -f docker-compose.prod.yml down
sudo rm -rf traefik/letsencrypt/acme.json
docker compose --env-file .env.production -f docker-compose.prod.yml up -d traefik
```

### Problema: Backend no inicia

```bash
# Ver logs detallados
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend

# Verificar conexión a PostgreSQL
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma db pull

# Verificar variables de entorno
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend printenv | grep DATABASE_URL

# Verificar que PostgreSQL está corriendo
docker compose --env-file .env.production -f docker-compose.prod.yml ps postgres
```

### Problema: Migraciones fallan

```bash
# Ver estado de migraciones
cd backend
npx prisma migrate status

# Ver logs de migración
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend | grep -i "migration\|prisma"

# Forzar aplicación manual
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma migrate deploy

# Si hay conflictos, resolver manualmente
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma migrate resolve --applied [migration_name]
```

### Problema: Frontend no conecta con backend

```bash
# Verificar que API_URL está correcta
cat .env.production | grep API_URL

# Verificar CORS en backend
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend | grep CORS

# Verificar routing de Traefik
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep "api.sergioja.com"

# Test directo al backend
curl https://api.sergioja.com/health
```

### Problema: Sitio lento o no responde

```bash
# Ver uso de recursos
docker stats

# Ver logs de Traefik (puede estar bloqueando)
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | tail -100

# Verificar rate limiting
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend | grep "rate limit"

# Reiniciar servicios
docker compose --env-file .env.production -f docker-compose.prod.yml restart
```

### Limpiar contenedores y volúmenes

```bash
# Detener y eliminar contenedores
docker compose --env-file .env.production -f docker-compose.prod.yml down

# Eliminar también volúmenes (⚠️ ELIMINA LA BASE DE DATOS)
docker compose --env-file .env.production -f docker-compose.prod.yml down -v
```

### Verificar configuración cargada

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml config
```

---

## 🔄 RESET COMPLETO (Empezar desde cero)

⚠️ **ADVERTENCIA CRÍTICA**: Esto eliminará todos los contenedores, imágenes y datos.
**HACER BACKUP ANTES DE PROCEDER**

### Opción A: Reset completo (incluye base de datos)

```bash
# 1. BACKUP OBLIGATORIO
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_pre_reset_$(date +%F_%H-%M-%S).sql

# 2. Detener y eliminar todo
docker compose --env-file .env.production -f docker-compose.prod.yml down --rmi all --volumes --remove-orphans

# 3. Limpieza profunda de Docker
docker image prune -a -f
docker volume prune -f
docker network prune -f
docker builder prune -a -f

# 4. Eliminar certificados SSL (se regenerarán)
sudo rm -rf traefik/letsencrypt/acme.json

# 5. Seguir pasos de "DESPLIEGUE INICIAL" desde el principio
```

### Opción B: Reset conservando base de datos

```bash
# 1. BACKUP RECOMENDADO
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_pre_reset_$(date +%F_%H-%M-%S).sql

# 2. Detener y eliminar contenedores e imágenes (conservar volúmenes)
docker compose --env-file .env.production -f docker-compose.prod.yml down --rmi all --remove-orphans

# 3. Limpieza (sin volúmenes)
docker image prune -a -f
docker network prune -f
docker builder prune -a -f

# 4. Rebuild y reiniciar servicios
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

---

## 💾 BACKUP Y RESTORE

### Backup de base de datos (CRÍTICO)

```bash
# Backup completo
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup_$(date +%F_%H-%M-%S).sql

# Backup comprimido (recomendado para producción)
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > backup_$(date +%F_%H-%M-%S).sql.gz

# Backup automático (agregar a cron)
0 2 * * * cd /ruta/proyecto && docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > /backups/backup_$(date +\%F_\%H-\%M-\%S).sql.gz
```

### Restore de base de datos

```bash
# Desde archivo SQL
docker compose --env-file .env.production -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER $DB_NAME < backup_2024-12-15.sql

# Desde archivo comprimido
gunzip -c backup_2024-12-15.sql.gz | docker compose --env-file .env.production -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER $DB_NAME
```

### Backup de volúmenes Docker

```bash
# Backup del volumen de PostgreSQL
docker run --rm -v sergioja-postgres-data:/data -v $(pwd):/backup alpine tar czf /backup/postgres_volume_$(date +%F).tar.gz /data

# Backup de logs de Traefik
docker run --rm -v sergioja-traefik-logs:/data -v $(pwd):/backup alpine tar czf /backup/traefik_logs_$(date +%F).tar.gz /data
```

---

## 📝 NOTAS IMPORTANTES

### Optimizaciones implementadas (Fase 1)

✅ **Connection Pool**: Configuración automática de pool de conexiones (10 conexiones, 20s timeout)  
✅ **Startup Optimizado**: Migraciones solo se aplican si hay cambios pendientes  
✅ **Índices Optimizados**: Índice compuesto para cleanup de tokens  
✅ **Queries Optimizadas**: Skills query usa `select` en lugar de cargar proyectos completos  
✅ **Middleware Optimizado**: Eliminada duplicación de redirección www  

### Flujo de migraciones en producción

1. **Desarrollo**: `npx prisma migrate dev` genera y prueba migraciones
2. **Commit**: Subir archivos de migración al repositorio
3. **Producción**: Al rebuild del backend, verifica estado con `prisma migrate status`
4. **Deploy condicional**: Solo ejecuta `prisma migrate deploy` si hay cambios
5. **Sin downtime**: Migraciones se aplican antes de iniciar el servidor

### Seguridad en producción

- ✅ Traefik maneja TLS automáticamente con Let's Encrypt
- ✅ Redirección automática HTTP → HTTPS
- ✅ Redirección www → non-www
- ✅ Rate limiting configurado (100 req/15min)
- ✅ CORS restrictivo solo para dominios autorizados
- ✅ JWT con refresh tokens en cookies httpOnly
- ✅ reCAPTCHA Enterprise en formularios

### Monitoreo recomendado

```bash
# Ver uso de recursos en tiempo real
docker stats

# Ver logs de errores
docker compose --env-file .env.production -f docker-compose.prod.yml logs | grep -i "error\|warn\|fail"

# Ver requests al backend
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend | grep "GET\|POST\|PUT\|DELETE"

# Ver certificados SSL
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep -i certificate
```

### Comandos útiles

```bash
# Ver todos los contenedores (incluso detenidos)
docker ps -a

# Ver espacio en disco
docker system df

# Limpiar imágenes antiguas (liberar espacio)
docker image prune -a

# Ver configuración final cargada
docker compose --env-file .env.production -f docker-compose.prod.yml config
```

### Contacto y soporte

Para issues o dudas sobre el despliegue:
- Email: contact@sergioja.com
- Logs: `/var/log/` dentro de cada contenedor
- Traefik Dashboard: https://traefik.sergioja.com
