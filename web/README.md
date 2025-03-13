# 🐶🛡️ Courage The Honeypot (solo next.js, eres un poco raro)

Este proyecto es el frontend de Courage The Honeypot desarrollado en Next.js, utilizando Prisma para el manejo de la base de datos y el analisis de intentos.

## 📻 Instalación y Uso

### 1️⃣ Requisitos

- Node.js
- Prisma

### 2️⃣ Instalación Manual (sin Docker)

1. Clona el repositorio y accede al directorio del frontend:

   ```bash
   git clone https://github.com/pointedsec/CourageTheHoneypot.git
   cd CourageTheHoneypot/web
   ```

2. Instala las dependencias:

   ```bash
   npm install --force
   ```

3. Crea el archivo de entorno (.env):

   ```bash
   touch .env
   ```
4. Agrega las variables de entorno necesarias:
    ```
    SESSION_SECRET=17D7F1B795368471A7C6B75497315512 (ejemplo)
    ADMIN_USERNAME=admin
    ADMIN_PASSWORD=f7ec910e206861d603198695f0bf3d83 (admin)
    ADMIN_PASSWORD_SALT=super_secret_salt (salt para la contraseña, si se cambia el hash de arriba no será válido)
    DATABASE_URL="file:/home/andres/Desktop/Proyectos/CourageTheHoneypot/honeypot/ssh_honeypot.db" (Ruta de la base de datos generada por **create_database.py**)
    ```

5. Configurar Prisma y generar el cliente:

   ```bash
   npx prisma db pull
   npx prisma generate
   ```

5. Inicia el servidor (en modo desarrollo, puedes hacer un build si quieres):

   ```bash
   npm run dev
   ```

## 🔍 Registro de Datos

- **Usuarios y contraseñas:** Usuario y contraseña ingresados por el atacante.
- **Sesiones activas:** Inicio y fin de sesión de cada atacante.
- **Comandos ejecutados:** Cada comando ingresado es registrado en la base de datos.

## ⚠️ Advertencia

Este honeypot no debe usarse en entornos de producción sin medidas de seguridad adicionales. Se recomienda ejecutarlo en una máquina aislada y revisar la legalidad de su uso en tu país.