# Etapa 1: Dependencias
FROM node:18-alpine AS deps

WORKDIR /app

# Copiar archivos de dependencias
COPY admin/package*.json ./
RUN npm install

# Etapa 2: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar directorio shared
COPY shared /shared

# Copiar dependencias
COPY --from=deps /app/node_modules ./node_modules

# Copiar código fuente de admin
COPY admin/. .

# Argumentos de build para variables públicas
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_SITE_URL
ARG NEXT_PUBLIC_JWT_SECRET
ARG NEXT_PUBLIC_GTM_ID
ARG NEXT_PUBLIC_RECAPTCHA_SITE_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_JWT_SECRET=$NEXT_PUBLIC_JWT_SECRET
ENV NEXT_PUBLIC_GTM_ID=$NEXT_PUBLIC_GTM_ID
ENV NEXT_PUBLIC_RECAPTCHA_SITE_KEY=$NEXT_PUBLIC_RECAPTCHA_SITE_KEY

# Build de Next.js
RUN ln -s /app/node_modules /shared/node_modules
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
