#!/bin/sh

echo "Generando archivo .env dinámicamente..."
cat <<EOF > .env
SESSION_SECRET=$SESSION_SECRET
ADMIN_USERNAME=$ADMIN_USERNAME
ADMIN_PASSWORD=$ADMIN_PASSWORD
ADMIN_PASSWORD_SALT=$ADMIN_PASSWORD_SALT
DATABASE_URL="file:/app/honeypot/ssh_honeypot.db"
EOF

echo "Ejecutando Prisma DB Pull..."
npx prisma db pull

echo "Generando el cliente Prisma"
npx prisma generate

echo "Construyendo la aplicación Next.js..."
npm run build --force

echo "Iniciando la aplicación en modo producción..."
npm run start
