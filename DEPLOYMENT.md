# 🚀 Guía de Despliegue - SergioJA Ecosystem

## Requisitos Previos

- Docker y Docker Compose instalados
- Archivo `.env` configurado en la raíz del proyecto
- Dominio configurado con DNS apuntando al servidor
- Certificados SSL (Traefik los genera automáticamente con Let's Encrypt)

## Comandos de Despliegue

### 1. Iniciar Traefik (Proxy Reverso)

```bash
docker compose --env-file .env -f docker-compose.yml up -d traefik
```

### 2. Iniciar Backend (API)

```bash
docker compose --env-file .env -f docker-compose.yml up -d backend
```

### 3. Iniciar Frontend Main (sergioja.com)

```bash
docker compose --env-file .env -f docker-compose.yml up -d main-frontend
```

### 4. Iniciar Frontend Portfolio (portfolio.sergioja.com)

```bash
docker compose --env-file .env -f docker-compose.yml up -d portfolio-frontend
```

### 5. Iniciar Frontend Admin (admin.sergioja.com)

```bash
docker compose --env-file .env -f docker-compose.yml up -d admin-frontend
```

### 6. Iniciar Todos los Servicios

```bash
docker compose --env-file .env -f docker-compose.yml up -d
```

## Comandos de Gestión

### Ver logs de un servicio

```bash
docker compose --env-file .env -f docker-compose.yml logs -f [servicio]
```

Ejemplos:
```bash
docker compose --env-file .env -f docker-compose.yml logs -f traefik
docker compose --env-file .env -f docker-compose.yml logs -f backend
docker compose --env-file .env -f docker-compose.yml logs -f main
docker compose --env-file .env -f docker-compose.yml logs -f portfolio
```

### Reiniciar un servicio

```bash
docker compose --env-file .env -f docker-compose.yml restart [servicio]
```

### Detener servicios

```bash
docker compose --env-file .env -f docker-compose.yml down
```

### Reconstruir y reiniciar (después de cambios en código)

```bash
docker compose --env-file .env -f docker-compose.yml up -d --build [servicio]
```

### Ver estado de los servicios

```bash
docker compose --env-file .env -f docker-compose.yml ps
```

## Variables de Entorno Importantes

### Para Producción (.env)

Asegúrate de configurar correctamente estas variables:

```bash
# API debe apuntar al dominio público, NO a localhost
API_URL=https://api.sergioja.com

# Dominios frontend permitidos para CORS
FRONTEND_URLS=https://sergioja.com,https://portfolio.sergioja.com

# reCAPTCHA Enterprise
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=tu_site_key_real
RECAPTCHA_SITE_KEY=tu_site_key_real
RECAPTCHA_ENTERPRISE_PROJECT_ID=tu_project_id
RECAPTCHA_ENTERPRISE_API_KEY=tu_api_key
```

**IMPORTANTE**: Si `API_URL` apunta a `localhost`, los frontends intentarán conectarse a la red local del dispositivo del usuario, causando errores de permisos de red.

## Desarrollo Local

Para desarrollo local, usa el archivo `.env` y `docker-compose.yml`:

```bash
docker compose up -d
```

O para servicios específicos:

```bash
docker compose up -d traefik
docker compose up -d backend
```

## Verificación Post-Despliegue

1. **Traefik Dashboard**: https://traefik.sergioja.com (si está configurado)
2. **Backend Health**: https://api.sergioja.com/health
3. **Main Frontend**: https://sergioja.com
4. **Portfolio Frontend**: https://portfolio.sergioja.com
5. **Admin Panel**: https://admin.sergioja.com

## Troubleshooting

### Ver logs en tiempo real de todos los servicios

```bash
docker compose --env-file .env -f docker-compose.yml logs -f
```

### Verificar variables de entorno cargadas

```bash
docker compose --env-file .env -f docker-compose.yml config
```

### Limpiar contenedores y volúmenes

```bash
docker compose --env-file .env -f docker-compose.yml down -v
```

## Reset desde cero (migración limpia)

Advertencia: la opción A elimina la base de datos (volúmenes). Realiza un backup si necesitas conservar datos.

### Opción A: reset completo (incluye DB)

```bash
# Eliminar contenedores, imágenes, volúmenes y órfanos
docker compose --env-file .env -f docker-compose.yml down --rmi all --volumes --remove-orphans

# Limpieza adicional (opcional)
docker image prune -a -f
docker volume prune -f
docker network prune -f
docker builder prune -a -f

# Despliegue limpio
docker compose --env-file .env -f docker-compose.yml up -d --build backend
docker compose --env-file .env -f docker-compose.yml up -d --build main-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build portfolio-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build admin-frontend
# Tomar cambios de seed (Bdd)
docker compose --env-file .env -f docker-compose.yml exec backend npm run db:seed
docker compose --env-file .env -f docker-compose.yml exec backend npx prisma db push

```

### Opción B: reset conservando DB

```bash
# Eliminar contenedores e imágenes, conservar volúmenes
docker compose --env-file .env -f docker-compose.yml down --rmi all --remove-orphans

# Limpieza adicional (sin borrar volúmenes)
docker image prune -a -f
docker network prune -f
docker builder prune -a -f

# Despliegue limpio
docker compose --env-file .env -f docker-compose.yml up -d traefik
docker compose --env-file .env -f docker-compose.yml up -d --build backend
docker compose --env-file .env -f docker-compose.yml up -d --build main-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build portfolio-frontend
docker compose --env-file .env -f docker-compose.yml up -d --build admin-frontend
```

### Backup y verificación (recomendado)

```bash
# Backup DB (ajusta credenciales/servicio si es necesario)
docker exec -i sergioja-postgres pg_dump -U "$DB_USER" "$DB_NAME" > backup_$(date +%F).sql

# Verificar variables cargadas
docker compose --env-file .env -f docker-compose.yml config

# Estado y logs
docker compose --env-file .env -f docker-compose.yml ps
docker compose --env-file .env -f docker-compose.yml logs -f

#Crear usuario admin
docker compose --env-file .env.production -f docker-compose.prod.yml exec backend npx tsx scripts/create-admin.ts
```

## Notas Importantes

- **Siempre** usa `--env-file .env` en producción
- Los certificados SSL se generan automáticamente en el primer despliegue
- Traefik debe iniciarse primero para que los otros servicios se registren correctamente
- Los logs se almacenan en `/var/log/` dentro de cada contenedor
