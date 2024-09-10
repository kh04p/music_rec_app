from flask import Blueprint, render_template, request, current_app
import sys

bp = Blueprint("pages", __name__)

def shutdown_server():
    func = request.environ.get('werkzeug.server.shutdown')
    if func is None:
        raise RuntimeError('Server is not running.')
    func()

@bp.route("/")
def home():
    #current_app.logger.info("Test Warning")
    #print('This is error output', file=sys.stderr)
    #print('Standard output', file=sys.stdout)
    
    return render_template("pages/home.html")


@bp.route("/about")
def about():
    return render_template("pages/about.html")

@bp.route("/hardstop")

def hardstop():
    shutdown_server()
    return "Server shutting down..."