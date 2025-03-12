#!/usr/bin/python3
# SiSoyHoneypot - Python + SQLite + NextJS = SUCCESS!
#
# Author: Andrés Del Cerro (pointedsec)
# Basic Honeypot Script by securehoney -> https://securehoney.net/blog/how-to-build-an-ssh-honeypot-in-python-and-docker-part-1.html
# Highly Edited by pointedsec
#

import argparse
import threading
import socket
import sys
import traceback
from logger import logging
import paramiko
import sqlite3
import os

#
# TABLES = {
#     'intentos': '''
#         CREATE TABLE IF NOT EXISTS intentos (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             ip VARCHAR(45),
#             username VARCHAR(50),
#             password VARCHAR(50),
#             timestamp TIMESTAMP,
#             status VARCHAR(10),
#             id_sesion INTEGER,
#             FOREIGN KEY (id_sesion) REFERENCES sesion(id)
#         );
#     ''',
#     'sesion': '''
#         CREATE TABLE IF NOT EXISTS sesion (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             start_time TIMESTAMP,
#             end_time TIMESTAMP,
#             id_intento INTEGER,
#             FOREIGN KEY (id_intento) REFERENCES intentos(id)
#         );
#     ''',
#     'comandos': '''
#         CREATE TABLE IF NOT EXISTS comandos (
#             id INTEGER PRIMARY KEY AUTOINCREMENT,
#             id_sesion INTEGER,
#             command TEXT,
#             timestamp TIMESTAMP,
#             FOREIGN KEY (id_sesion) REFERENCES sesion(id)
#         );
#     '''
# }
#

HOST_KEY = paramiko.RSAKey(filename='server.key')
SSH_BANNER = "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1"
LOGGING_ATTEMPTS = 2 # Intentos de inicio de sesión que se rechazaran (el tercero será válido)

UP_KEY = '\x1b[A'.encode()
DOWN_KEY = '\x1b[B'.encode()
RIGHT_KEY = '\x1b[C'.encode()
LEFT_KEY = '\x1b[D'.encode()
BACK_KEY = '\x7f'.encode()

db_filename = 'ssh_honeypot.db'

def check_database():
    if not os.path.exists(db_filename):
        print("La base de datos no existe. Creando una nueva...")
        os.system("%s %s" % (sys.executable, 'create_database.py'))

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    filename='ssh_honeypot.log')

def handle_cmd(cmd, chan, ip):

    response = ""
    if cmd.startswith("ls"):
        response = "users.txt"
    elif cmd.startswith("pwd"):
        response = "/home/root"

    if response != '':
        logging.info('Response from honeypot ({}): '.format(ip, response))
        response = response + "\r\n"
    chan.send(response)


class BasicSshHoneypot(paramiko.ServerInterface):

    client_ip = None
    attempts = 0
    conn = None
    sesion_id = None

    def __init__(self, client_ip, sesion_id):
        self.client_ip = client_ip
        self.sesion_id = sesion_id
        self.event = threading.Event()
        # Database connection
        self.conn = sqlite3.connect(db_filename, check_same_thread=False)

    def check_channel_request(self, kind, chanid):
        logging.info('client called check_channel_request ({}): {}'.format(
                    self.client_ip, kind))
        if kind == 'session':
            return paramiko.OPEN_SUCCEEDED

    def get_allowed_auths(self, username):
        logging.info('client called get_allowed_auths ({}) with username {}'.format(
                    self.client_ip, username))
        return "publickey,password"    

    def check_auth_password(self, username, password):
        # Aceptar el inicio de sesión dependiendo del numero de intentos que se lleve
        if self.attempts > LOGGING_ATTEMPTS:
            logging.info('new client credentials ({}): username: {}, password: {}'.format(
                        self.client_ip, username, password))
            self.conn.execute("INSERT INTO intentos (ip, username, password, timestamp, status, id_sesion) VALUES (?,?,?,CURRENT_TIMESTAMP,?,?)",
                (self.client_ip, username, password, "OK", self.sesion_id)
            )
            self.conn.commit()
            self.attempts = LOGGING_ATTEMPTS + 1
            return paramiko.AUTH_SUCCESSFUL
        else:
            logging.info('new client credentials ({}): username: {}, password: {}'.format(
                        self.client_ip, username, password))
            self.attempts += 1
            self.conn.execute("INSERT INTO intentos (ip, username, password, timestamp, status, id_sesion) VALUES (?,?,?,CURRENT_TIMESTAMP,?,?)",
                (self.client_ip, username, password, "FAIL", self.sesion_id)
            )
            self.conn.commit()
            return paramiko.AUTH_FAILED

    def check_channel_shell_request(self, channel):
        self.event.set()
        return True

    def check_channel_pty_request(self, channel, term, width, height, pixelwidth, pixelheight, modes):
        return True

def handle_connection(client, addr):

    conn = sqlite3.connect(db_filename, check_same_thread=False)
    client_ip = addr[0]
    logging.info('New connection from: {}'.format(client_ip))

    try:
        transport = paramiko.Transport(client)
        transport.add_server_key(HOST_KEY)
        transport.local_version = SSH_BANNER # Change banner to appear more convincing
        conn.execute("INSERT INTO sesion (start_time) VALUES (CURRENT_TIMESTAMP)")
        sesion_id = conn.execute("SELECT last_insert_rowid() FROM sesion").fetchone()[0]
        conn.commit()
        logging.info('Sesion ID: {}'.format(sesion_id))
        server = BasicSshHoneypot(client_ip, sesion_id)
        try:
            transport.start_server(server=server)

        except paramiko.SSHException:
            print('*** SSH negotiation failed.')
            raise Exception("SSH negotiation failed")

        # wait for auth
        chan = transport.accept(10)
        if chan is None:
            print('*** No channel (from '+client_ip+').')
            raise Exception("No channel")
        
        chan.settimeout(10)

        if transport.remote_mac != '':
            logging.info('Client mac ({}): {}'.format(client_ip, transport.remote_mac))

        if transport.remote_compression != '':
            logging.info('Client compression ({}): {}'.format(client_ip, transport.remote_compression))

        if transport.remote_version != '':
            logging.info('Client SSH version ({}): {}'.format(client_ip, transport.remote_version))
            
        if transport.remote_cipher != '':
            logging.info('Client SSH cipher ({}): {}'.format(client_ip, transport.remote_cipher))

        server.event.wait(10)
        if not server.event.is_set():
            logging.info('** Client ({}): never asked for a shell'.format(client_ip))
            raise Exception("No shell request")
     
        try:
            chan.send("Welcome to Ubuntu 18.04.4 LTS (GNU/Linux 4.15.0-128-generic x86_64)\r\n\r\n")
            run = True
            while run:
                chan.send("$ ")
                command = ""
                while not command.endswith("\r"):
                    transport = chan.recv(1024)
                    print(client_ip+"- received:",transport)
                    # Echo input to psuedo-simulate a basic terminal
                    if(
                        transport != UP_KEY
                        and transport != DOWN_KEY
                        and transport != LEFT_KEY
                        and transport != RIGHT_KEY
                        and transport != BACK_KEY
                    ):
                        chan.send(transport)
                        command += transport.decode("utf-8")
                
                chan.send("\r\n")
                command = command.rstrip()
                logging.info('Command receied ({}): {}'.format(client_ip, command))
                conn.execute("INSERT INTO comandos (timestamp, command, id_sesion) VALUES (CURRENT_TIMESTAMP,?,?)",
                    (command, sesion_id)
                )
                conn.commit()

                if command == "exit":
                    logging.info("Connection closed (via exit command): " + client_ip + "\n")
                    chan.send("Adios cibercriminal ;)")
                    run = False
                    conn.execute("UPDATE sesion SET end_time = CURRENT_TIMESTAMP WHERE id = ?", (sesion_id,))
                    conn.commit()
                    conn.close()
                else:
                    handle_cmd(command, chan, client_ip)

        except Exception as err:
            print('!!! Exception: {}: {}'.format(err.__class__, err))
            conn.execute("UPDATE sesion SET end_time = CURRENT_TIMESTAMP WHERE id = ?", (sesion_id,))
            conn.commit()
            conn.close()
            try:
                transport.close()
            except Exception:
                pass

        chan.close()

    except Exception as err:
        print('!!! Exception: {}: {}'.format(err.__class__, err))
        conn.execute("UPDATE sesion SET end_time = CURRENT_TIMESTAMP WHERE id = ?", (sesion_id,))
        conn.commit()
        conn.close()
        try:
            transport.close()
        except Exception:
            pass


def start_server(port, bind):
    """Init and run the ssh server"""
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind((bind, port))
    except Exception as err:
        print('*** Bind failed: {}'.format(err))
        traceback.print_exc()
        sys.exit(1)

    threads = []
    while True:
        try:
            sock.listen(100)
            print('Listening for connection ...')
            client, addr = sock.accept()
        except Exception as err:
            print('*** Listen/accept failed: {}'.format(err))
            traceback.print_exc()
        new_thread = threading.Thread(target=handle_connection, args=(client, addr))
        new_thread.start()
        threads.append(new_thread)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Run an SSH honeypot server')
    parser.add_argument("--port", "-p", help="The port to bind the ssh server to (default 22)", default=2222, type=int, action="store")
    parser.add_argument("--bind", "-b", help="The address to bind the ssh server to", default="", type=str, action="store")
    args = parser.parse_args()
    check_database()
    start_server(args.port, args.bind)