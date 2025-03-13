#!/bin/bash

# Definir los argumentos base
CMD_ARGS="-p 2222"

# Si USE_GROQ está en true, agregar -g
if [ "$USE_GROQ" = "true" ]; then
  CMD_ARGS="-g $CMD_ARGS"
fi

# Ejecutar el honeypot con los argumentos
exec python main.py $CMD_ARGS
