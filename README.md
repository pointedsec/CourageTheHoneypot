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

# 🚀 Tutorial de Uso
## 1️⃣ Acceder al Panel

Una vez que el contenedor está en ejecución, abre tu navegador y ve a:

👉 http://localhost:3000

## 2️⃣ Iniciar Sesión

Usa las siguientes credenciales por defecto:

```
    Usuario: admin
    Contraseña: admin
```


# Si necesitas reiniciar el honeypot, usa los siguientes comandos:

```
docker-compose down  # Detiene y elimina los contenedores  
docker-compose up -d  # Vuelve a iniciarlo en segundo plano  
```

# ⚠️ Problema con Conexiones Simultáneas

Dado que CourageTheHoneypot utiliza SQLite como base de datos, existe una limitación importante:

## 👉 No se pueden conectar varios atacantes simultáneamente.

SQLite maneja un sistema de bloqueo de escritura cuando una transacción está en curso, lo que significa que si un atacante está ejecutando comandos dentro de la sesión, otros intentos de conexión pueden fallar temporalmente.
## 🕒 ¿Cómo se maneja este problema?

Para mitigar esta limitación, se ha implementado un timeout en la base de datos. Esto permite que, si una conexión está bloqueando el acceso, el sistema espere un tiempo antes de aceptar la siguiente conexión disponible.

🔹 Solución recomendada a futuro: Para un mejor manejo de múltiples conexiones concurrentes, se podría migrar a una base de datos más robusta como PostgreSQL o MySQL en futuras versiones del proyecto.

# 🚀 ¡Se aceptan contribuciones!

Este es un proyecto open-source, por lo que cualquier mejora, corrección o nueva funcionalidad es bienvenida.

✅ Si tienes una idea para mejorar el honeypot, haz un fork del repositorio y envía un Pull Request (PR).
✅ Puedes reportar bugs o sugerencias creando un Issue en el repositorio.

🙌 ¡Gracias por apoyar el desarrollo de este proyecto!

## 🛡️ Seguridad

> ⚠️ **Advertencia**: Este proyecto está diseñado con fines educativos y de investigación. No debe utilizarse en producción sin medidas de seguridad adecuadas.