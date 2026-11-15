#!/usr/bin/env python3
"""
SPACE MISSION 3D – NASA EXPLORER
Local Development Server (Python 3 - Threaded Multi-Connection)

Run with: python server.py
"""

import http.server
import socket
import os
import sys

PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class SpaceMissionHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def end_headers(self):
        # Prevent aggressive browser caching during development and simulation
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        self.send_header('Access-Control-Allow-Origin', '*')
        super().end_headers()

    def do_GET(self):
        # Handle favicon without 404 logging
        if self.path == '/favicon.ico':
            self.send_response(204)
            self.end_headers()
            return
        return super().do_GET()

    def log_message(self, format, *args):
        # Clean formatted output
        sys.stdout.write(f"[{self.log_date_time_string()}] {format % args}\n")
        sys.stdout.flush()

class ReusableThreadingServer(http.server.ThreadingHTTPServer):
    allow_reuse_address = True
    daemon_threads = True

if __name__ == '__main__':
    os.chdir(DIRECTORY)
    # Bind to all interfaces or localhost
    server_address = ('', PORT)
    try:
        with ReusableThreadingServer(server_address, SpaceMissionHandler) as httpd:
            url = f"http://localhost:{PORT}"
            print("=" * 65)
            print("  🚀 SPACE MISSION 3D – NASA EXPLORER")
            print("  NASA Space Apps Hackathon Simulation Server (Threaded)")
            print(f"  Live at: {url}")
            print("  Multi-threaded HTTP connection handler active.")
            print("  Press Ctrl+C to terminate.")
            print("=" * 65)
            sys.stdout.flush()
            httpd.serve_forever()
    except OSError as e:
        print(f"Error binding to port {PORT}: {e}")
        sys.exit(1)
    except KeyboardInterrupt:
        print("\nServer terminated by user.")
