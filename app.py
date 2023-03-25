import os
import platform
import socket
import time
from flask import Flask, jsonify, __version__ as flask_version

app = Flask(__name__)

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

if __name__ == '__main__':
    from gunicorn.app.wsgiapp import WSGIApplication
    app_to_run = WSGIApplication()
    app_to_run.load_wsgiapp = lambda: app
    app_to_run.run()

