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
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public" npx prisma generate

# Compilar TypeScript
RUN npm run build

# Etapa 2: Producción
FROM node:20-bookworm-slim

WORKDIR /app

# Instalar dependencias del sistema necesarias para Prisma en runtime
RUN apt-get update && apt-get install -y --no-install-recommends openssl libssl3 ca-certificates \
    && update-ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Prisma logs optimizados para producción
ENV PRISMA_LOG_LEVEL=warn \
    PRISMA_QUERY_ENGINE_LOG_LEVEL=warn \
    RUST_LOG=error

# (No es necesario copiar shared en runtime)

# Copiar dependencias y build desde builder
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/package*.json ./

# Regenerar cliente de Prisma en producción (necesario para runtime)
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public" npx prisma generate

# Crear directorio para logs
RUN mkdir -p /app/logs

# Exponer puerto
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Script de arranque con diagnóstico
RUN echo '#!/bin/sh' > /usr/local/bin/start.sh && \
    echo 'set -e' >> /usr/local/bin/start.sh && \
    echo 'echo "Node: $(node -v)"' >> /usr/local/bin/start.sh && \
    echo 'echo "OpenSSL: $(node -p \"process.versions.openssl\")"' >> /usr/local/bin/start.sh && \
    echo 'echo "Prisma CLI:"' >> /usr/local/bin/start.sh && \
    echo 'npx prisma -v' >> /usr/local/bin/start.sh && \
    echo 'echo "DATABASE_URL: $(printenv DATABASE_URL | sed -e \"s#://[^:]*:[^@]*@#://****@#\")"' >> /usr/local/bin/start.sh && \
    echo 'echo "Validating schema..."' >> /usr/local/bin/start.sh && \
    echo 'npx prisma validate' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo 'echo "Applying database changes..."' >> /usr/local/bin/start.sh && \
    echo 'if npx prisma migrate deploy 2>/dev/null; then' >> /usr/local/bin/start.sh && \
    echo '  echo "✓ Migrations applied successfully"' >> /usr/local/bin/start.sh && \
    echo 'else' >> /usr/local/bin/start.sh && \
    echo '  echo "⚠ migrate deploy failed, falling back to db push..."' >> /usr/local/bin/start.sh && \
    echo '  npx prisma db push --skip-generate --accept-data-loss' >> /usr/local/bin/start.sh && \
    echo '  echo "✓ Database schema synchronized with db push"' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo 'exec npm start' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Comando de inicio
CMD ["/usr/local/bin/start.sh"]
