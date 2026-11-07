import os, sys, threading, webbrowser
ROOT = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(ROOT, "app"))
os.chdir(os.path.join(ROOT, "app"))
import launch
url, server = launch.ensure_server()
print("serving:", url)
webbrowser.open(url)
try:
    threading.Event().wait()
except KeyboardInterrupt:
    pass
finally:
    if server:
        server.shutdown(); server.server_close()