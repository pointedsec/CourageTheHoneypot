# 🐶🛡️ Courage The Honeypot (solo honeypot)

Este honeypot SSH captura intentos de acceso no autorizados, almacena credenciales ingresadas y registra comandos ejecutados por los atacantes. Ademas puedes utilizar Groq para poder generar respuestas con IA en tiempo real para engañar al atacante y que crea que está en un entorno real.

## 📂 Estructura del Proyecto

```
honeypot/
├── create_database.py    # Script para crear/verificar la base de datos
├── main.py               # Código principal del honeypot
├── server.key            # Clave privada del servidor SSH
├── server.pub            # Clave pública del servidor SSH
├── ssh_honeypot.db       # Base de datos SQLite
├── Dockerfile            # Configuración de Docker
├── requirements.txt      # Dependencias del proyecto
└── README.md             # Este archivo
```

## 🚀 Instalación y Uso 

### 1️⃣ Requisitos

- Python 3.10+
- SQLite3+
- Docker (opcional)

### 2️⃣ Instalación Manual (Sin Docker)

1. Clona el repositorio y accede al directorio del honeypot:

   ```bash
   git clone https://github.com/pointedsec/CourageTheHoneypot.git
   cd CourageTheHoneypot/honeypot
   ```

2. Instala las dependencias:

   ```bash
   pip install -r requirements.txt
   ```

3. Crea/verifica la base de datos:

   ```bash
   python create_database.py
   ```

4. Ejecuta el honeypot y con el parámetro **-p** especifica el puerto a usar (por defecto 22, ejecutar con **sudo**):

   ```bash
   python main.py -p 2222
   ```

5. Si se quiere utilizar Groq, primero conseguir una API KEY y luego modificar la variable de entorno **GROQ_API_KEY** del archivo **main.py** con tu API KEY, después ejecutar el honeypot con el parámetro **-g**
    ```bash
    python main.py -p 2222 -g
   ```

### 3️⃣ Uso con Docker

1. DEsde el directorio raíz utiliza el archivo **docker-compose.yml** para desplegar todo el entorno:

   ```bash
   docker-compose up --build
   ```

## 🔍 Registro de Datos

- **Usuarios y contraseñas:** Usuario y contraseña ingresados por el atacante.
- **Sesiones activas:** Inicio y fin de sesión de cada atacante.
- **Comandos ejecutados:** Cada comando ingresado es registrado en la base de datos.

Los datos quedan almacenados en `ssh_honeypot.db` en formato SQLite.

## ⚠️ Advertencia

Este honeypot no debe usarse en entornos de producción sin medidas de seguridad adicionales. Se recomienda ejecutarlo en una máquina aislada y revisar la legalidad de su uso en tu país.