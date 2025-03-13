<p align="center">
  <img src="./web/public/logo.png" alt="CourageTheHoneypot Logo" width="200"/>
</p>

<h1 align="center">Courage The Honeypot</h1>

<p align="center">
  🛡️ Un honeypot SSH avanzado, integración con IA y con un panel de control en Next.js para visualizar y analizar intentos de acceso. 🚀
</p>

---

## 📌 Características

- 🏴‍☠️ **Honeypot SSH** desarrollado en Python para atrapar atacantes. Implementa una opción para utilizar Groq y generar respuestas realistas para el atacante en tiempo real.
- 📊 **Dashboard en Next.js** para visualizar intentos de acceso y estadísticas.
- 🛠️ **SQLite y Prisma** como base de datos para almacenar la actividad.
- 📈 **Gráficos interactivos** para análisis de datos.
- 🐳 **Despliegue con Docker** para fácil configuración y uso.

## 🚀 Instalación y Uso

### 1️⃣ Clonar el Repositorio

```bash
git clone https://github.com/pointedsec/CourageTheHoneypot.git
cd CourageTheHoneypot
```

### 2️⃣ Construcción y Ejecución con Docker

```bash
docker-compose up --build
```

Esto iniciará tanto el honeypot como el dashboard.

### 3️⃣ Acceder al Panel

Una vez en ejecución, abre en tu navegador:

```
http://localhost:3000
```

## 🛡️ Seguridad

> ⚠️ **Advertencia**: Este proyecto está diseñado con fines educativos y de investigación. No debe utilizarse en producción sin medidas de seguridad adecuadas.