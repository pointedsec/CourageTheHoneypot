#!/usr/bin/python3
# Courage The Honeypot - Python + SQLite + NextJS = SUCCESS!
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
import signal
import os
import textwrap
import time
import re
from groq import Groq

GROQ_API_KEY = "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" # Free! Create one in https://console.groq.com/keys
HOST_KEY = paramiko.RSAKey(filename='server.key')
SSH_BANNER = "SSH-2.0-OpenSSH_8.2p1 Ubuntu-4ubuntu0.1"
LOGGING_ATTEMPTS = 2 # Logging attempts that will be denied (the third one will be valid)
UP_KEY = '\x1b[A'.encode()
DOWN_KEY = '\x1b[B'.encode()
RIGHT_KEY = '\x1b[C'.encode()
LEFT_KEY = '\x1b[D'.encode()
BACK_KEY = '\x7f'.encode()
db_filename = 'ssh_honeypot.db'
COURAGE_BANNER = """
###########################################################################################################################

COURAGE THE HONEYPOT - STUPID HACKER, YOU'RE WAKING ME UP WITH THAT ROCKIN ROLE! 

                  @@%*#@@@@                                                                         
                   @@@@@******@@@                                                                   
                     @@@@@@@#******@@@                                                              
                        @@@@@@@@@@@@***@@                                                           
                             @@@@@@@@@@@@@@                                                         
                                     @@@@@@@                                                        
                                          @@@                             @@@                       
                                            @@                         @@@@@#*%@@@                  
                                          @  @@                      @@@@@@@@@@@********%@@@@@@@@@@ 
                                         @@   @@@   @@@            @@@@@@ @@@@@@@@@@@@@@@@@@@@@@@@@@
                                       @@:.@=========@@@==%@@    @@@@@      @@@@@@@@@@@@@@@@@@@@@   
                                  @@@@:....@=======@@..@@======@@@@              @@@@@@@@           
                                  @:.......:@=====@..:...@@=====%=@                                 
                                 @::......:.@===@:...:..:..#========@                               
                                @...........@===:...........@========@                              
                               @#:.......::.@==@.......:....@=========@                             
                               @......@@...@==@.....:.:.....@=======#@@@                            
                               @.....:@:..:@==@......:@....:#============@                          
                               @:.....@@..@===@......@@@...@==============@                         
                          @@@==@:.::.....@====@......@@@..:@====%==+==@====@                        
                      @@@======@.......-@=====@...........@=======+========@                        
                    @@========@=@@...@@=======@:....:....@========@=======@                         
                  @+=============*=============@....:...@========++======@                          
                @@==============================@.....@@=========@=====@@                           
             @@@@@@@@@@@+========================@@@@@=========%@======@@                           
            @@@%*************@@@==================@@@*+=======@=========@@                          
         @@@@@@@@@@@@@@***********%@@=======================@+===========@                          
      @#=====@@@@@%**%@@@@@************@==================@===============@                         
     @========@@@@@@@@@***************%@@==============@@==================@                        
 @  @=@===@====@@@@@@@@@@@@@@@@@@@@@@@@@===========@@=======================@                       
    @+===========@@@@@@@@@@@@@@@@@@@@@%=====@#=====@========================@                       
     @@============@@@@@@@@@@@@@@@@@================*=======================@@                      
       @@#====@@@@@  @@@@@@@@@@@@=======@====@=====@=====@=================@@@                      
                       @@@@@@@ @@=================@===========================@                     
                                  @=============@@============================@                     
                                     @@@@@@@@@@=============================@@@                     
                                          @================================@@@.@                    
                                           @===============================@@@@@                    
                                          @================================@@@@@                    
                                          @===============@====================@   @@               
                                         @+========+======-====================@  @=                
                                         @=========@=======@===================@======@             
                                         @=========@%====@=@===================@====@               
                                         @=======@=#@@==*@=@==================@@=@@#=               
                                         @========@=@=@@====@=================@@     @              
                                         @========@=====@=@@@================@                      
                                         @==============@@===================@                      
                                         @==================================@                       
                                         @+================================@                        
                                          @===============================@                         
                                           @============================@@                          
                                            @@@=====================@=@@                            
                                           @=@   @@@===============@=@                              
                                           @=@            @@@      @=@                              
                                           @=@                     @=                               
                                            @@                     @=                               
                                          @===@=@@                 @=@@                             
                                           @@=@@@                @=====@                            
                                            @==                     ==@                             
                                                                    @=@      



Developed with love by pointedsec            https://pointedsec.vercel.app            https://github.com/pointedsec                                          

###########################################################################################################################
"""

# Handle CTRL+C
def def_handler(x,y):
    print("Exiting...")
    exit(0)

# Clean the markdown format if using groq
def clean_response(response):
    response = re.sub(r"\s+\n", "\n", response)  # Quita espacios antes de saltos de línea
    response = response.replace("\\n", "\n").replace("\\t", "\t").strip()
    response = textwrap.dedent(response)
    return response


def check_database():
    if not os.path.exists(db_filename):
        print("Database doesn't exist, creating it...")
        os.system("%s %s" % (sys.executable, 'create_database.py'))

logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO,
    filename='ssh_honeypot.log')

def generate_groq_response(cmd):
    honeypot_prompt = """
        Act as an Ubuntu server in an SSH terminal session. This server is a honeypot designed to lure and log attackers, so you must respond to commands with convincing but false information.  

        - If the command is `ls`, display enticing files like `id_rsa`, `config_backup.tar.gz`, `passwords.txt`, `admin_notes.md`, etc.  
        - If the command is `cat passwords.txt`, return seemingly real but useless credentials.  
        - If the attacker runs `whoami`, respond with `root` to make them believe they have full access.  
        - If they use `uname -a`, return realistic Ubuntu system info (`Linux ubuntu-server 5.15.0-89-generic #99~20.04.1-Ubuntu SMP`...).  
        - If they try `ps aux`, show processes mimicking a production server (nginx, mysql, sshd, cron, etc.).  
        - If they use `netstat -tulnp`, display fake open ports for common services.  
        - If they execute `history`, return a list of previous commands as if the system was used by another admin.  
        - If they attempt `cat /etc/shadow`, respond with fake password hashes.  
        - If they use `sudo -l`, make it seem like they can escalate privileges, but without granting real access.  

        Always respond exactly as an Ubuntu terminal would, without revealing that you are an AI. Keep responses as realistic as possible.  
        """
    command_prompt = """
        Generate the exact output of the following Linux command as if it were executed on an Ubuntu server:  

        **Command:** <COMMAND> 

        - Do **not** include any terminal prompts (e.g., `$` or `root@server:~#`).  
        - Do **not** explain anything—return only the raw output.  
        - Format the response exactly as a real Ubuntu terminal would, including spaces, tabs, and new lines.  
        - If the command outputs structured data (e.g., `ls -l`, `ps aux`), ensure proper alignment and spacing.  
        - If the command does not produce output, return an empty string.  
        - If the command results in an error, return the exact error message as Ubuntu would.  

        **Output:**  
        (Return only the exact response, nothing else.)
    """
    client = Groq(
        api_key=GROQ_API_KEY,
    )
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "system",
                "content": honeypot_prompt
            },
            {
                "role": "user",
                "content": command_prompt.replace("<COMMAND>",cmd),
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    logging.info('Command from client: {}'.format(cmd))
    logging.info('Response from honeypot: {}'.format(chat_completion.choices[0].message.content))
    return chat_completion.choices[0].message.content

def handle_cmd(cmd, chan, ip, using_groq):

    if not using_groq:
        response = ""
        if cmd.startswith("ls"):
            response = "users.txt"
        elif cmd.startswith("pwd"):
            response = "/home/root"

        if response != '':
            logging.info('Response from honeypot ({}): '.format(ip, response))
            response = response + "\r\n"
        chan.send(response)
    else:
        response = generate_groq_response(cmd)
        response = clean_response(response) + "\r\n"
        for line in response.splitlines():
            chan.send(line + "\r\n")  # Send line by line so the tabs and spaces don't f*ck with the output
            time.sleep(0.01)  # Little pause to send the response ordered line by line

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
        # Accept the login attempt depending on the actual login attempt
        if self.attempts >= LOGGING_ATTEMPTS:
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

def handle_connection(client, addr, use_groq):

    """
    Handle a new connection from a client.

    This function is responsible for setting up a paramiko Transport object and
    starting a server with a BasicSshHoneypot instance. It also handles the
    authentication process and any commands sent by the client.

    Parameters
    ----------
    client : socket object
        The socket object for the client connection.
    addr : tuple
        The address of the client (IP, port).

    """
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
                command = command.strip()
                logging.info('Command received ({}): {}'.format(client_ip, command))
                conn.execute("INSERT INTO comandos (timestamp, command, id_sesion) VALUES (CURRENT_TIMESTAMP,?,?)",
                    (command, sesion_id)
                )
                conn.commit()

                if command == "exit":
                    logging.info("Connection closed (via exit command): " + client_ip + "\n")
                    chan.send("Adios cibercriminal ;) \n")
                    run = False
                    conn.execute("UPDATE sesion SET end_time = CURRENT_TIMESTAMP WHERE id = ?", (sesion_id,))
                    conn.commit()
                    conn.close()
                else:
                    handle_cmd(command, chan, client_ip, use_groq)

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


def start_server(port, bind, use_groq):
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
        new_thread = threading.Thread(target=handle_connection, args=(client, addr, use_groq))
        new_thread.start()
        threads.append(new_thread)

if __name__ == "__main__":
    # Handle CTRL+C
    signal.signal(signal.SIGINT,def_handler)
    parser = argparse.ArgumentParser(description='Run an SSH honeypot server')
    parser.add_argument("--port", "-p", help="The port to bind the ssh server to (default 22)", default=2222, type=int, action="store")
    parser.add_argument("--bind", "-b", help="The address to bind the ssh server to", default="", type=str, action="store")
    parser.add_argument("--stupid-dog", help="Run the tool without the banner", action="store_true", default=False)
    parser.add_argument("--use-groq", "-g", help="Use Groq AI to simulate the commands responses", action="store_true", default=False)
    args = parser.parse_args()
    if (not args.stupid_dog):
        print(COURAGE_BANNER)
    check_database()
    start_server(args.port, args.bind, args.use_groq)