import os
import platform
import socket
import time
import json
from flask import Flask, jsonify, __version__ as flask_version
import redis

app = Flask(__name__)

redis_host = os.getenv("REDIS_HOST", "db")
redis_port = os.getenv("REDIS_PORT", 6379)
r = redis.Redis(host=redis_host, port=redis_port, decode_responses=True)

@app.route('/')
def hello_world():
    return 'Hello, World!'

@app.route('/status')
def status():
    status_info = {
        "os": f"{platform.system()} {platform.release()}",
        "hostname": socket.gethostname(),
        "python_version": platform.python_version(),
        "flask_version": flask_version,
        "current_time": time.ctime(),
        "working_directory": os.getcwd(),
    }
    return jsonify(status_info)

@app.route('/tides')
def tides():
    tides = r.get("tides")
    if tides:
        return jsonify(json.loads(tides))
    else:
        return jsonify({"error": "Tide data not available"}), 500

if __name__ == '__main__':
    from gunicorn.app.wsgiapp import WSGIApplication
    app_to_run = WSGIApplication()
    app_to_run.load_wsgiapp = lambda: app
    app_to_run.run()

