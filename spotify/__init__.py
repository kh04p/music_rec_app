import requests
import json
from random import randint
from flask import Flask

from spotify import pages


def create_app():
    app = Flask(__name__)

    app.register_blueprint(pages.bp)
    app.config['TEMPLATES_AUTO_RELOAD'] = True
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0
    
    return app