# 🚀 Guía de Despliegue - SergioJA Portfolio

Esta guía cubre el despliegue completo del monorepo SergioJA (Main + Portfolio + Backend) en un servidor VPS usando Docker Compose y Traefik.

---

## 📋 Tabla de Contenidos

1. [Requisitos Previos](#requisitos-previos)
2. [Configuración del Servidor](#configuración-del-servidor)
3. [Configuración DNS](#configuración-dns)
4. [Preparación del Proyecto](#preparación-del-proyecto)
5. [Despliegue](#despliegue)
6. [Verificación](#verificación)
7. [Mantenimiento](#mantenimiento)
8. [Troubleshooting](#troubleshooting)

---

## 📦 Requisitos Previos

### Servidor VPS
- **Sistema Operativo**: Ubuntu 20.04+ / Debian 11+
- **RAM**: Mínimo 2GB (recomendado 4GB)
- **Disco**: Mínimo 20GB
- **CPU**: 2 cores recomendado
- **Proveedor**: Hostinger VPS (o cualquier otro)

### Software Necesario
- Docker Engine 24.0+
- Docker Compose 2.20+
- Git

### Servicios Externos
- ✅ Google Cloud (reCAPTCHA Enterprise)
- ✅ Google Workspace (SMTP para emails)
- ✅ Dominio configurado (sergioja.com)

---

## 🖥️ Configuración del Servidor

### 1. Conectar al VPS

```bash
ssh root@tu-vps-ip
# O con usuario no-root
ssh usuario@tu-vps-ip
```

### 2. Actualizar el sistema

```bash
sudo apt update && sudo apt upgrade -y
```

### 3. Instalar Docker

```bash
# Instalar dependencias
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Agregar repositorio de Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker-archive-keyring.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Instalar Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Verificar instalación
docker --version
docker compose version
```

### 4. Configurar permisos de Docker (opcional, para usuario no-root)

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### 5. Configurar Firewall

```bash
# Permitir SSH, HTTP y HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
sudo ufw status
```

---

## 🌐 Configuración DNS

Configura los siguientes registros DNS en tu proveedor de dominio (ej: Namecheap, GoDaddy, Cloudflare):

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| A | @ | `IP_DEL_VPS` | 3600 |
| A | www | `IP_DEL_VPS` | 3600 |
| A | portfolio | `IP_DEL_VPS` | 3600 |
| A | www.portfolio | `IP_DEL_VPS` | 3600 |
| A | api | `IP_DEL_VPS` | 3600 |
| A | traefik | `IP_DEL_VPS` | 3600 |

**Verificar propagación DNS:**
```bash
# Desde tu máquina local
dig sergioja.com
dig portfolio.sergioja.com
dig api.sergioja.com

# Debe mostrar la IP de tu VPS
```

⏱️ **Nota**: La propagación DNS puede tardar de 5 minutos a 48 horas.

---

## 📁 Preparación del Proyecto

### 1. Clonar el repositorio en el servidor

```bash
# Opción A: Desde GitHub (recomendado)
cd /opt
sudo git clone https://github.com/tu-usuario/sergioja.git
cd sergioja

# Opción B: Subir manualmente con SCP
# Desde tu máquina local:
scp -r /ruta/local/sergioja usuario@vps-ip:/opt/
```

### 2. Configurar variables de entorno

```bash
# Copiar el archivo de producción
cp .env.production .env

# Editar si es necesario
nano .env
```

**Verificar que `.env` contenga:**
```env
# API URL pública
API_URL=https://api.sergioja.com

# CORS
FRONTEND_URLS=https://sergioja.com,https://portfolio.sergioja.com,https://www.sergioja.com,https://www.portfolio.sergioja.com

# reCAPTCHA
RECAPTCHA_BYPASS_DEV=false

# Resto de variables...
```

### 3. Crear directorios necesarios

```bash
# Directorio para certificados SSL
mkdir -p letsencrypt
chmod 600 letsencrypt

# Directorio para logs del backend
mkdir -p backend/logs
chmod 755 backend/logs
```

### 4. Configurar permisos

```bash
# Si estás como root
chown -R $USER:$USER /opt/sergioja

# O con sudo
sudo chown -R usuario:usuario /opt/sergioja
```

---

## 🚀 Despliegue

### 1. Build y levantar servicios

```bash
cd /opt/sergioja

# Build de imágenes y levantar contenedores
docker compose -f docker-compose.prod.yml up -d --build
```

**Esto iniciará:**
- ✅ Traefik (Reverse Proxy + SSL)
- ✅ PostgreSQL (Base de datos)
- ✅ Backend API (Express + Prisma)
- ✅ Portfolio Frontend (Next.js)
- ✅ Main Frontend (Next.js)

### 2. Monitorear el despliegue

```bash
# Ver logs de todos los servicios
docker compose -f docker-compose.prod.yml logs -f

# Ver logs de un servicio específico
docker logs sergioja-traefik -f
docker logs sergioja-backend -f
docker logs portfolio-frontend -f
docker logs main-frontend -f
```

### 3. Esperar a que Let's Encrypt genere certificados

```bash
# Monitorear logs de Traefik
docker logs sergioja-traefik -f

# Buscar líneas como:
# "Certificate obtained for domain sergioja.com"
# "Certificate obtained for domain portfolio.sergioja.com"
# "Certificate obtained for domain api.sergioja.com"
```

⏱️ **Tiempo estimado**: 2-5 minutos (si DNS está propagado correctamente)

---

## ✅ Verificación

### 1. Verificar contenedores activos

```bash
docker ps

# Deberías ver 5 contenedores corriendo:
# - sergioja-traefik
# - sergioja-postgres
# - sergioja-backend
# - portfolio-frontend
# - main-frontend
```

### 2. Verificar salud del backend

```bash
# Desde el servidor
curl http://localhost:5000/health

# Desde el navegador
https://api.sergioja.com/health

# Respuesta esperada:
# {"status":"ok","timestamp":"...","uptime":...}
```

### 3. Verificar sitios web

Abre en tu navegador:

- ✅ **Main**: https://sergioja.com
- ✅ **Portfolio**: https://portfolio.sergioja.com
- ✅ **API Health**: https://api.sergioja.com/health
- ✅ **Traefik Dashboard** (opcional): https://traefik.sergioja.com

### 4. Probar formulario de contacto

1. Ve a https://sergioja.com o https://portfolio.sergioja.com/contact
2. Llena el formulario
3. Envía
4. Verifica que:
   - ✅ No hay errores de CORS
   - ✅ reCAPTCHA funciona (invisible)
   - ✅ Recibes email de notificación en `contact@sergioja.com`
   - ✅ El usuario recibe email de confirmación

### 5. Verificar certificados SSL

```bash
# Verificar certificados generados
ls -la letsencrypt/

# Verificar en navegador
# Debe mostrar candado verde y certificado válido de Let's Encrypt
```

---

## 🔧 Mantenimiento

### Actualizar el código

```bash
cd /opt/sergioja

# Pull de cambios
git pull origin main

# Rebuild y reiniciar servicios
docker compose -f docker-compose.prod.yml up -d --build

# Ver logs
docker compose -f docker-compose.prod.yml logs -f
```

### Reiniciar servicios

```bash
# Reiniciar todos los servicios
docker compose -f docker-compose.prod.yml restart

# Reiniciar un servicio específico
docker compose -f docker-compose.prod.yml restart backend
docker compose -f docker-compose.prod.yml restart portfolio-frontend
```

### Ver logs

```bash
# Logs en tiempo real
docker compose -f docker-compose.prod.yml logs -f

# Logs de un servicio específico
docker logs sergioja-backend -f --tail 100

# Logs de las últimas 24 horas
docker logs sergioja-backend --since 24h
```

### Backup de base de datos

```bash
# Crear backup manual
docker exec sergioja-postgres pg_dump -U sergioja_bdd_admin sergioja_bdd > backup-$(date +%Y%m%d-%H%M%S).sql

# Restaurar backup
docker exec -i sergioja-postgres psql -U sergioja_bdd_admin sergioja_bdd < backup-20241112-180000.sql
```

**Automatizar backups diarios:**

```bash
# Crear script de backup
nano /opt/sergioja/backup-db.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/opt/sergioja/backups"
mkdir -p $BACKUP_DIR
docker exec sergioja-postgres pg_dump -U sergioja_bdd_admin sergioja_bdd > $BACKUP_DIR/backup-$(date +%Y%m%d).sql

# Mantener solo últimos 7 días
find $BACKUP_DIR -name "backup-*.sql" -mtime +7 -delete
```

```bash
# Dar permisos
chmod +x /opt/sergioja/backup-db.sh

# Agregar a crontab (backup diario a las 2 AM)
crontab -e
# Agregar: 0 2 * * * /opt/sergioja/backup-db.sh
```

### Monitoreo de recursos

```bash
# Ver uso de recursos de contenedores
docker stats

# Ver espacio en disco
df -h

# Ver logs de sistema
journalctl -u docker -f
```

### Detener servicios

```bash
# Detener todos los servicios
docker compose -f docker-compose.prod.yml down

# Detener y eliminar volúmenes (⚠️ BORRA LA BASE DE DATOS)
docker compose -f docker-compose.prod.yml down -v
```

---

## 🐛 Troubleshooting

### Problema: Certificados SSL no se generan

**Síntomas:**
- Error "SSL certificate problem" en el navegador
- Logs de Traefik muestran errores de ACME

**Soluciones:**

1. **Verificar DNS:**
   ```bash
   dig sergioja.com
   dig portfolio.sergioja.com
   dig api.sergioja.com
   # Debe mostrar la IP del VPS
   ```

2. **Verificar puertos abiertos:**
   ```bash
   sudo ufw status
   # Debe mostrar 80/tcp y 443/tcp ALLOW
   ```

3. **Ver logs de Traefik:**
   ```bash
   docker logs sergioja-traefik -f
   # Buscar errores de ACME/Let's Encrypt
   ```

4. **Reiniciar Traefik:**
   ```bash
   docker compose -f docker-compose.prod.yml restart traefik
   ```

5. **Limpiar certificados y reintentar:**
   ```bash
   rm -rf letsencrypt/*
   docker compose -f docker-compose.prod.yml restart traefik
   ```

---

### Problema: Backend no conecta a PostgreSQL

**Síntomas:**
- Error 500 en API
- Logs muestran "ECONNREFUSED" o "database connection failed"

**Soluciones:**

1. **Verificar que Postgres esté corriendo:**
   ```bash
   docker ps | grep postgres
   docker logs sergioja-postgres
   ```

2. **Verificar credenciales en `.env`:**
   ```bash
   cat .env | grep DB_
   ```

3. **Probar conexión manualmente:**
   ```bash
   docker exec -it sergioja-postgres psql -U sergioja_bdd_admin -d sergioja_bdd
   ```

4. **Reiniciar servicios en orden:**
   ```bash
   docker compose -f docker-compose.prod.yml restart postgres
   sleep 10
   docker compose -f docker-compose.prod.yml restart backend
   ```

---

### Problema: CORS errors en el navegador

**Síntomas:**
- Error en consola: "Access to fetch at 'https://api.sergioja.com' from origin 'https://sergioja.com' has been blocked by CORS policy"

**Soluciones:**

1. **Verificar `FRONTEND_URLS` en `.env`:**
   ```bash
   cat .env | grep FRONTEND_URLS
   # Debe incluir todos tus dominios con https://
   ```

2. **Actualizar y reiniciar backend:**
   ```bash
   nano .env
   # Agregar dominios faltantes
   docker compose -f docker-compose.prod.yml restart backend
   ```

3. **Verificar labels de Traefik en `docker-compose.prod.yml`:**
   - Debe tener middleware de CORS configurado

---

### Problema: reCAPTCHA no funciona

**Síntomas:**
- Error "reCAPTCHA verification failed" al enviar formulario
- Token inválido en backend

**Soluciones:**

1. **Verificar dominios en Google Cloud Console:**
   - Ve a: https://console.cloud.google.com/security/recaptcha
   - Asegúrate de que `sergioja.com` y `portfolio.sergioja.com` estén en la lista

2. **Verificar variables en `.env`:**
   ```bash
   cat .env | grep RECAPTCHA
   # Verificar que RECAPTCHA_BYPASS_DEV=false en producción
   ```

3. **Ver logs del backend:**
   ```bash
   docker logs sergioja-backend -f
   # Buscar errores de reCAPTCHA
   ```

---

### Problema: Emails no se envían

**Síntomas:**
- Formulario se envía pero no llegan emails
- Logs muestran "Email service not available"

**Soluciones:**

1. **Verificar configuración SMTP en `.env`:**
   ```bash
   cat .env | grep SMTP
   ```

2. **Verificar contraseña de aplicación de Google:**
   - Debe ser la contraseña de aplicación (16 caracteres sin espacios)
   - NO la contraseña de tu cuenta de Google

3. **Ver logs del backend:**
   ```bash
   docker logs sergioja-backend -f | grep -i email
   ```

4. **Probar SMTP manualmente:**
   ```bash
   docker exec -it sergioja-backend node -e "
   const nodemailer = require('nodemailer');
   const transporter = nodemailer.createTransport({
     host: 'smtp.gmail.com',
     port: 587,
     auth: { user: 'contact@sergioja.com', pass: 'TU_APP_PASSWORD' }
   });
   transporter.verify().then(console.log).catch(console.error);
   "
   ```

---

### Problema: Sitio lento o no responde

**Soluciones:**

1. **Verificar recursos del servidor:**
   ```bash
   docker stats
   htop
   df -h
   ```

2. **Verificar logs de errores:**
   ```bash
   docker compose -f docker-compose.prod.yml logs --tail 100
   ```

3. **Reiniciar servicios:**
   ```bash
   docker compose -f docker-compose.prod.yml restart
   ```

4. **Limpiar recursos de Docker:**
   ```bash
   docker system prune -a
   ```

---

## 📞 Soporte

### Logs importantes

```bash
# Todos los servicios
docker compose -f docker-compose.prod.yml logs -f

# Backend
docker logs sergioja-backend -f

# Traefik
docker logs sergioja-traefik -f

# PostgreSQL
docker logs sergioja-postgres -f
```

### Información del sistema

```bash
# Versiones
docker --version
docker compose version

# Estado de contenedores
docker ps -a

# Uso de recursos
docker stats

# Espacio en disco
df -h
```

---

## 🎯 Checklist de Despliegue

- [ ] VPS configurado con Docker y Docker Compose
- [ ] DNS configurados y propagados
- [ ] Firewall configurado (puertos 80, 443, 22)
- [ ] Proyecto clonado en `/opt/sergioja`
- [ ] `.env` configurado con valores de producción
- [ ] Dominios agregados en reCAPTCHA Enterprise
- [ ] `docker compose -f docker-compose.prod.yml up -d --build` ejecutado
- [ ] Certificados SSL generados (verificar logs de Traefik)
- [ ] Sitios accesibles vía HTTPS
- [ ] Formulario de contacto funciona
- [ ] Emails se envían correctamente
- [ ] Backup automático configurado

---

## 📚 Recursos Adicionales

- [Documentación de Docker](https://docs.docker.com/)
- [Documentación de Traefik](https://doc.traefik.io/traefik/)
- [Let's Encrypt](https://letsencrypt.org/)
- [Google reCAPTCHA Enterprise](https://cloud.google.com/recaptcha-enterprise/docs)
- [Nodemailer (SMTP)](https://nodemailer.com/)

---

**¡Listo para producción! 🚀**
