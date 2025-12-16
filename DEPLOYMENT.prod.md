# 🚀 Guía de Despliegue - PRODUCCIÓN

## ⚠️ Pre-requisitos

- DNS configurado (A records apuntando al servidor)
- Puertos 80 y 443 abiertos
- `.env.production` configurado

---

## 📦 Primera Vez

```bash
# 1. Verificar DNS
dig sergioja.com +short

# 2. Traefik (primero - proxy reverso y SSL)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d traefik

# 3. PostgreSQL (base de datos)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d postgres

# 4. Backend (espera a que postgres esté healthy)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend

# 5. Frontends (dependen del backend)
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build portfolio-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build main-frontend
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build admin-frontend

# 6. Crear admin (esperar 60s)
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx tsx scripts/create-admin.ts

# 7. Verificar SSL (esperar 2min para Let's Encrypt)
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep certificate

# 8. Test
curl https://api.sergioja.com/health
```

**Orden de inicio:** traefik → postgres → backend → frontends

**Alternativa rápida (todo a la vez):**
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

**URLs:**
- Main: https://sergioja.com
- Portfolio: https://portfolio.sergioja.com
- Admin: https://admin.sergioja.com
- API: https://api.sergioja.com
- Traefik: https://traefik.sergioja.com

---

## 🔄 Actualizar Código

```bash
# Backend (con backup automático si hay migrations)
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME > backup.sql
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build backend

# Frontend específico
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build portfolio-frontend

# Todo
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

---

## 🛠️ Comandos Útiles

```bash
# Alias para simplificar
alias dcp='docker compose --env-file .env.production -f docker-compose.prod.yml'

# Logs
dcp logs -f backend

# Reiniciar
dcp restart backend

# Detener
dcp down

# Estado
dcp ps

# Shell
dcp exec backend sh
dcp exec postgres psql -U $DB_USER -d $DB_NAME

# Recursos
docker stats
```

---

## 🗄️ Migraciones Prisma

```bash
# Ver estado
cd backend && npx prisma migrate status

# Aplicar manual (si falla automático)
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma migrate deploy
```

---

## 🔍 Variables Críticas (.env.production)

```bash
# ⚠️ API_URL debe ser dominio público, NO localhost
API_URL=https://api.sergioja.com

# ⚠️ JWT secrets únicos (openssl rand -base64 32)
JWT_SECRET=tu_jwt_secret_produccion
JWT_REFRESH_SECRET=tu_refresh_secret_produccion

# ⚠️ DB password seguro
DB_PASSWORD=TU_PASSWORD_SEGURO

# CORS incluir www y sin www
FRONTEND_URLS=https://sergioja.com,https://portfolio.sergioja.com,https://admin.sergioja.com,https://www.sergioja.com,https://www.portfolio.sergioja.com
```


---

## 🐛 Troubleshooting

```bash
# SSL no genera
docker compose --env-file .env.production -f docker-compose.prod.yml logs traefik | grep certificate
sudo netstat -tulpn | grep -E ':(80|443)'

# Backend no inicia
docker compose --env-file .env.production -f docker-compose.prod.yml logs backend
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx prisma db pull

# Frontend no conecta
cat .env.production | grep API_URL
curl https://api.sergioja.com/health

# Regenerar certificados SSL
mkdir -p ./letsencrypt
sudo rm -f ./letsencrypt/acme.json
docker compose --env-file .env.production -f docker-compose.prod.yml restart traefik
```

---

## 🔄 Reset Total

⚠️ **ADVERTENCIA CRÍTICA: Esto eliminará TODOS los contenedores, imágenes, volúmenes, datos y certificados SSL**

```bash
# 1. Backup DB (OBLIGATORIO)
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > backup_$(date +%F).sql.gz

# 2. Detener y eliminar todo
docker compose --env-file .env.production -f docker-compose.prod.yml down -v --rmi all --remove-orphans

# 3. Eliminar certificados SSL
sudo rm -rf ./letsencrypt/acme.json

# 4. Limpiar Docker completo
docker system prune -a --volumes -f

# 5. Verificar limpieza
docker ps -a
docker images
docker volume ls

# 6. Reiniciar desde cero (ver sección "Primera Vez")
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```

**Alternativa: Conservar DB**
```bash
# Solo eliminar contenedores e imágenes (mantener volúmenes y DB)
docker compose --env-file .env.production -f docker-compose.prod.yml down --rmi all --remove-orphans
docker system prune -a -f
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build
```


---

## 💾 Backup & Restore

```bash
# Backup DB
docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > backup_$(date +%F).sql.gz

# Restore DB
gunzip -c backup.sql.gz | docker compose --env-file .env.production -f docker-compose.prod.yml exec -T postgres psql -U $DB_USER $DB_NAME

# Backup automático (cron)
0 2 * * * cd /ruta/proyecto && docker compose --env-file .env.production -f docker-compose.prod.yml exec postgres pg_dump -U $DB_USER $DB_NAME | gzip > /backups/backup_$(date +\%F).sql.gz
```

