#!/usr/bin/env python3
import atexit
import traceback
import http.client
import itertools
import os
import signal
import subprocess
import sys
import time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer


PROJECT_DIR = "/home/pi/project TXT to HTML 1.0"
FRONTEND_HOST = "0.0.0.0"
FRONTEND_PORT = 8080
BACKEND_HOST = "127.0.0.1"
BACKEND_PORTS = [8101, 8102, 8103, 8104]
BACKENDS = [(BACKEND_HOST, port) for port in BACKEND_PORTS]
ROUND_ROBIN = itertools.cycle(BACKENDS)
PROCESSES = []
DEBUG_LOG = os.path.join(PROJECT_DIR, "logs", "load_balancer_debug.log")


def debug(message):
    os.makedirs(os.path.dirname(DEBUG_LOG), exist_ok=True)
    with open(DEBUG_LOG, "a", encoding="utf-8") as log:
        log.write(message + "\n")
        log.flush()


class LoadBalancerHandler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def do_GET(self):
        self.proxy()

    def do_HEAD(self):
        self.proxy()

    def do_POST(self):
        self.proxy()

    def proxy(self):
        host, port = next(ROUND_ROBIN)
        body = None
        content_length = self.headers.get("Content-Length")
        if content_length:
            body = self.rfile.read(int(content_length))

        headers = {
            key: value
            for key, value in self.headers.items()
            if key.lower() not in {"host", "connection", "keep-alive", "proxy-connection"}
        }
        headers["X-Forwarded-Host"] = self.headers.get("Host", "")
        headers["X-Forwarded-Proto"] = "http"

        try:
            connection = http.client.HTTPConnection(host, port, timeout=15)
            connection.request(self.command, self.path, body=body, headers=headers)
            response = connection.getresponse()
            payload = response.read()

            self.send_response(response.status, response.reason)
            for key, value in response.getheaders():
                if key.lower() in {"connection", "keep-alive", "transfer-encoding"}:
                    continue
                self.send_header(key, value)
            self.send_header("X-Backend-Port", str(port))
            self.send_header("Connection", "close")
            self.end_headers()

            if self.command != "HEAD":
                self.wfile.write(payload)
            connection.close()
        except Exception as error:
            self.send_response(502, "Bad Gateway")
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.send_header("Connection", "close")
            self.end_headers()
            self.wfile.write(f"Backend {host}:{port} failed: {error}\n".encode("utf-8"))

    def log_message(self, message, *args):
        sys.stdout.write("%s - - [%s] %s\n" % (self.client_address[0], self.log_date_time_string(), message % args))
        sys.stdout.flush()


def start_backend(port):
    command = [
        sys.executable,
        "-m",
        "http.server",
        str(port),
        "--bind",
        BACKEND_HOST,
        "--directory",
        PROJECT_DIR,
    ]
    process = subprocess.Popen(command)
    PROCESSES.append(process)
    debug(f"started backend {port} pid={process.pid}")


def stop_backends():
    for process in PROCESSES:
        if process.poll() is None:
            process.terminate()
    for process in PROCESSES:
        try:
            process.wait(timeout=5)
        except subprocess.TimeoutExpired:
            process.kill()


def handle_shutdown(signum, frame):
    stop_backends()
    raise SystemExit(0)


def main():
    debug("load balancer booting")
    os.chdir(PROJECT_DIR)
    signal.signal(signal.SIGTERM, handle_shutdown)
    signal.signal(signal.SIGINT, handle_shutdown)
    atexit.register(stop_backends)

    for port in BACKEND_PORTS:
        start_backend(port)

    time.sleep(1)
    server = ThreadingHTTPServer((FRONTEND_HOST, FRONTEND_PORT), LoadBalancerHandler)
    server.daemon_threads = True
    print(f"Load balancer listening on {FRONTEND_HOST}:{FRONTEND_PORT}")
    print("Backends: " + ", ".join(f"{host}:{port}" for host, port in BACKENDS))
    debug(f"frontend listening on {FRONTEND_HOST}:{FRONTEND_PORT}")
    server.serve_forever()


if __name__ == "__main__":
    try:
        main()
    except Exception:
        debug(traceback.format_exc())
        raise
