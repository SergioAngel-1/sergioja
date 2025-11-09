# Etapa 1: Dependencias
FROM node:18-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY main/package*.json ./
RUN npm ci

# Etapa 2: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar directorio shared
COPY shared /shared

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente de main
COPY main/. .

# Argumento de build para la URL de la API
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Build de Next.js
RUN npm run build

# Etapa 3: Producción
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV production

# Crear usuario no-root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copiar archivos necesarios
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Cambiar ownership
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
