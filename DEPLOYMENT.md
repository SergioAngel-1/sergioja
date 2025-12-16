# 🚀 Guía de Despliegue - DESARROLLO LOCAL

## 📦 Primera Vez

```bash
# 1. PostgreSQL (primero - base de datos)
docker compose up -d postgres

# 2. Backend (espera a que postgres esté healthy)
docker compose up -d --build backend

# 3. Frontends (dependen del backend)
docker compose up -d --build portfolio-frontend
docker compose up -d --build main-frontend
docker compose up -d --build admin-frontend

# 4. Crear admin (esperar 30s a que backend inicie)
docker compose exec backend npx tsx scripts/create-admin.ts

# 5. Verificar
docker compose ps
curl http://localhost:5000/health
```

**Orden de inicio:** postgres → backend → frontends

**Alternativa rápida (todo a la vez):**
```bash
docker compose up -d --build
```

**URLs:**
- Backend: http://localhost:5000
- Portfolio: http://localhost:3000
- Main: http://localhost:3001
- Admin: http://localhost:3002

---

## 🔄 Actualizar Código

```bash
# Backend solo
docker compose up -d --build backend

# Frontend específico
docker compose up -d --build portfolio-frontend

# Todo
docker compose up -d --build
```

---

## 🛠️ Comandos Útiles

```bash
# Ver logs
docker compose logs -f backend

# Reiniciar
docker compose restart backend

# Detener todo
docker compose down

# Estado
docker compose ps

# Shell
docker compose exec backend sh
docker compose exec postgres psql -U postgres -d sergioja_bdd
```

---

## 🗄️ Migraciones Prisma

```bash
# Nueva migración
cd backend && npx prisma migrate dev --name cambio_descripcion

# Ver estado
npx prisma migrate status

# Reset DB (⚠️ borra todo)
npx prisma migrate reset
```

---

## 🐛 Troubleshooting

```bash
# Backend no inicia
docker compose logs backend
docker compose exec backend npx prisma db pull

# Backup DB
docker compose exec postgres pg_dump -U postgres sergioja_bdd > backup.sql

# Restore DB
docker compose exec -T postgres psql -U postgres sergioja_bdd < backup.sql
```

---

## 🔄 Reset Total

⚠️ **ADVERTENCIA: Esto eliminará TODOS los contenedores, imágenes, volúmenes y datos**

```bash
# 1. Backup DB (OBLIGATORIO)
docker compose exec postgres pg_dump -U postgres sergioja_bdd > backup_$(date +%F).sql

# 2. Detener y eliminar todo
docker compose down -v --rmi all --remove-orphans

# 3. Limpiar Docker completo
docker system prune -a --volumes -f

# 4. Verificar limpieza
docker ps -a
docker images
docker volume ls

# 5. Reiniciar desde cero (ver sección "Primera Vez")
docker compose up -d --build
```

**Alternativa: Conservar DB**
```bash
# Solo eliminar contenedores e imágenes (mantener volúmenes)
docker compose down --rmi all --remove-orphans
docker system prune -a -f
docker compose up -d --build
```

