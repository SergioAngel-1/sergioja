# Etapa 1: Build
FROM node:20-bookworm-slim AS builder

WORKDIR /app

# Copiar directorio shared (tipos compartidos)
COPY shared /shared

# Copiar archivos de dependencias del backend
COPY backend/package*.json ./
COPY backend/prisma ./prisma/

# Instalar dependencias del sistema necesarias para Prisma
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Limpiar cualquier instalación previa y instalar dependencias de npm
RUN rm -rf node_modules package-lock.json && npm install

# Copiar código fuente del backend
COPY backend/. .

# Generar cliente de Prisma
RUN npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: Producción
FROM node:20-bookworm-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma en runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Verbose Prisma logs
ENV PRISMA_LOG_LEVEL=debug \
    PRISMA_QUERY_ENGINE_LOG_LEVEL=debug \
    RUST_LOG=info

# (No es necesario copiar shared en runtime)

# Copiar dependencias y build desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package*.json ./

# Crear directorio para logs
RUN mkdir -p /app/logs

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Script de arranque con diagnóstico
RUN set -eux; \
  cat > /usr/local/bin/start.sh <<'SH' && chmod +x /usr/local/bin/start.sh
#!/bin/sh
set -e
echo "Node: $(node -v)"
echo "OpenSSL: $(node -p 'process.versions.openssl')"
echo "Prisma CLI:"
npx prisma -v
echo "DATABASE_URL: $(printenv DATABASE_URL | sed -e 's#://[^:]*:[^@]*@#://****@#')"
echo "Validating schema..."
npx prisma validate
echo "Running migrations (deploy)..."
npx prisma migrate deploy
exec npm start
SH

# Comando de inicio
CMD ["/usr/local/bin/start.sh"]
