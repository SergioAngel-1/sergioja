# 🚀 Guía de Despliegue - SergioJA Ecosystem

## Requisitos Previos

- Docker y Docker Compose instalados
- Archivo `.env.production` configurado en la raíz del proyecto
- Dominio configurado con DNS apuntando al servidor
- Certificados SSL (Traefik los genera automáticamente con Let's Encrypt)

## Comandos de Despliegue

### 1. Iniciar Traefik (Proxy Reverso)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d traefik
```

### 2. Iniciar Backend (API)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d backend
```

### 3. Iniciar Frontend Main (sergioja.com)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d main-frontend
```

### 4. Iniciar Frontend Portfolio (portfolio.sergioja.com)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d portfolio-frontend
```

### 5. Iniciar Todos los Servicios

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d
```

## Comandos de Gestión

### Ver logs de un servicio

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f [servicio]
```

Ejemplos:
```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f traefik
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f backend
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f main
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f portfolio
```

### Reiniciar un servicio

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml restart [servicio]
```

### Detener servicios

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down
```

### Reconstruir y reiniciar (después de cambios en código)

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml up -d --build [servicio]
```

### Ver estado de los servicios

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml ps
```

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

## Troubleshooting

### Ver logs en tiempo real de todos los servicios

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml logs -f
```

### Verificar variables de entorno cargadas

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml config
```

### Limpiar contenedores y volúmenes

```bash
docker compose --env-file .env.production -f docker-compose.prod.yml down -v
```

## Notas Importantes

- **Siempre** usa `--env-file .env.production` en producción
- Los certificados SSL se generan automáticamente en el primer despliegue
- Traefik debe iniciarse primero para que los otros servicios se registren correctamente
- Los logs se almacenan en `/var/log/` dentro de cada contenedor
