from flask import Flask
from music_rec_app import pages

app = Flask(__name__)

app.register_blueprint(pages.bp)
app.config['TEMPLATES_AUTO_RELOAD'] = True
app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 0

if __name__== "__main__":
    app.run(debug=True)