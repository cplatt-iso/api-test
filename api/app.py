import os
import platform
import socket
import time
import json
from flask import Flask, jsonify, __version__ as flask_version, request
from flask_cors import CORS
import redis

app = Flask(__name__)

cors = CORS(app, resources={r"/*": {"origins": "http://192.168.88.145"}})

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

@app.route('/api')
def api():
    # Check for unit parameter in request URL
    units = request.args.get('unit')
    if units == "ft":
        unit_factor = 3.28084
    else:
        unit_factor = 1

    # Get tide data from Redis
    tides = r.get("tides")
    if tides:
        tides = json.loads(tides)
        # Convert tide height to desired units
        for tide in tides:
            tide["height"] = tide["height"] * unit_factor
        return jsonify({"tides": tides})
    else:
        return jsonify({"error": "Tide data not available"}), 500

if __name__ == '__main__':
    from gunicorn.app.wsgiapp import WSGIApplication
    app_to_run = WSGIApplication()
    app_to_run.load_wsgiapp = lambda: app
    app_to_run.run()

