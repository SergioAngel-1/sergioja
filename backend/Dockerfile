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

# Script de arranque con diagnóstico y protección de producción
RUN echo '#!/bin/sh' > /usr/local/bin/start.sh && \
    echo 'set -e' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo '# Diagnostics' >> /usr/local/bin/start.sh && \
    echo 'echo "=== Environment Information ==="' >> /usr/local/bin/start.sh && \
    echo 'echo "Node: $(node -v)"' >> /usr/local/bin/start.sh && \
    echo 'echo "OpenSSL: $(node -p \"process.versions.openssl\")"' >> /usr/local/bin/start.sh && \
    echo 'echo "Prisma CLI:"' >> /usr/local/bin/start.sh && \
    echo 'npx prisma -v' >> /usr/local/bin/start.sh && \
    echo 'echo "DATABASE_URL: $(printenv DATABASE_URL | sed -e \"s#://[^:]*:[^@]*@#://****@#\")"' >> /usr/local/bin/start.sh && \
    echo 'echo ""' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo '# Validate Prisma schema' >> /usr/local/bin/start.sh && \
    echo 'echo "=== Validating Prisma Schema ==="' >> /usr/local/bin/start.sh && \
    echo 'if ! npx prisma validate; then' >> /usr/local/bin/start.sh && \
    echo '  echo "❌ ERROR: Prisma schema validation failed"' >> /usr/local/bin/start.sh && \
    echo '  exit 1' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'echo "✓ Schema validation passed"' >> /usr/local/bin/start.sh && \
    echo 'echo ""' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo '# Apply database migrations (PRODUCTION-SAFE)' >> /usr/local/bin/start.sh && \
    echo 'echo "=== Applying Database Migrations ==="' >> /usr/local/bin/start.sh && \
    echo 'if npx prisma migrate deploy; then' >> /usr/local/bin/start.sh && \
    echo '  echo "✓ Migrations applied successfully"' >> /usr/local/bin/start.sh && \
    echo 'else' >> /usr/local/bin/start.sh && \
    echo '  MIGRATE_EXIT_CODE=$?' >> /usr/local/bin/start.sh && \
    echo '  echo "❌ ERROR: Migration deployment failed with exit code $MIGRATE_EXIT_CODE"' >> /usr/local/bin/start.sh && \
    echo '  echo ""' >> /usr/local/bin/start.sh && \
    echo '  echo "CRITICAL: Database migrations failed in production."' >> /usr/local/bin/start.sh && \
    echo '  echo "This is a safety mechanism to prevent data loss."' >> /usr/local/bin/start.sh && \
    echo '  echo ""' >> /usr/local/bin/start.sh && \
    echo '  echo "Possible causes:"' >> /usr/local/bin/start.sh && \
    echo '  echo "  1. No migrations directory found (run: npm run db:migrate in development)"' >> /usr/local/bin/start.sh && \
    echo '  echo "  2. Migration files are missing or corrupted"' >> /usr/local/bin/start.sh && \
    echo '  echo "  3. Database connection failed"' >> /usr/local/bin/start.sh && \
    echo '  echo "  4. Migration conflicts with existing database state"' >> /usr/local/bin/start.sh && \
    echo '  echo ""' >> /usr/local/bin/start.sh && \
    echo '  echo "Action required:"' >> /usr/local/bin/start.sh && \
    echo '  echo "  - Check prisma/migrations/ directory exists and contains migration files"' >> /usr/local/bin/start.sh && \
    echo '  echo "  - Verify DATABASE_URL is correct"' >> /usr/local/bin/start.sh && \
    echo '  echo "  - Review migration logs above for specific errors"' >> /usr/local/bin/start.sh && \
    echo '  echo ""' >> /usr/local/bin/start.sh && \
    echo '  echo "IMPORTANT: db push is NOT used in production to prevent data loss."' >> /usr/local/bin/start.sh && \
    echo '  echo "All schema changes must go through proper migrations."' >> /usr/local/bin/start.sh && \
    echo '  exit 1' >> /usr/local/bin/start.sh && \
    echo 'fi' >> /usr/local/bin/start.sh && \
    echo 'echo ""' >> /usr/local/bin/start.sh && \
    echo '' >> /usr/local/bin/start.sh && \
    echo '# Start application' >> /usr/local/bin/start.sh && \
    echo 'echo "=== Starting Application ==="' >> /usr/local/bin/start.sh && \
    echo 'exec npm start' >> /usr/local/bin/start.sh && \
    chmod +x /usr/local/bin/start.sh

# Comando de inicio
CMD ["/usr/local/bin/start.sh"]
