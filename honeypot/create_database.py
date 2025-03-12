import sqlite3
import os

# Nombre del archivo de la base de datos (Si se cambia, se debe cambiar también de "main.py")
db_filename = 'ssh_honeypot.db'

# Definición de la estructura de las tablas
TABLES = {
    'intentos': '''
        CREATE TABLE IF NOT EXISTS intentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ip VARCHAR(45),
            username VARCHAR(50),
            password VARCHAR(50),
            timestamp TIMESTAMP,
            status VARCHAR(10),
            id_sesion INTEGER,
            FOREIGN KEY (id_sesion) REFERENCES sesion(id)
        );
    ''',
    'sesion': '''
        CREATE TABLE IF NOT EXISTS sesion (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            start_time TIMESTAMP,
            end_time TIMESTAMP
        );
    ''',
    'comandos': '''
        CREATE TABLE IF NOT EXISTS comandos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            id_sesion INTEGER,
            respuesta_comando VARCHAR(500),
            command TEXT,
            timestamp TIMESTAMP,
            FOREIGN KEY (id_sesion) REFERENCES sesion(id)
        );
    '''
}

# Función para verificar la existencia de las tablas
def check_table_existence(conn):
    existing_tables = set()
    cursor = conn.execute("SELECT name FROM sqlite_master WHERE type='table';")
    for row in cursor:
        existing_tables.add(row[0])
    return existing_tables

# Función para crear las tablas si no existen o están incompletas
def create_tables(conn):
    with conn:
        for table_name, create_statement in TABLES.items():
            print(f"Verificando y creando la tabla {table_name} si es necesario...")
            conn.execute(create_statement)
    print("Estructura de la base de datos verificada y completada.")

def main():
    # Verificar si el archivo de la base de datos ya existe
    if not os.path.exists(db_filename):
        print("La base de datos no existe. Creando una nueva...")
        conn = sqlite3.connect(db_filename)
        create_tables(conn)
        print("Base de datos creada y estructurada.")
    else:
        print("La base de datos existe. Verificando estructura...")
        conn = sqlite3.connect(db_filename)
        existing_tables = check_table_existence(conn)

        # Verificar si todas las tablas existen
        missing_tables = [table for table in TABLES.keys() if table not in existing_tables]
        if missing_tables:
            print(f"Faltan las siguientes tablas: {', '.join(missing_tables)}. Corrigiendo...")
            create_tables(conn)
        else:
            print("La base de datos está completa y bien formada.")

    conn.close()

if __name__ == '__main__':
    main()