FROM python:latest
WORKDIR /music_rec_app

COPY requirements.txt requirements.txt
RUN pip3 install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

ENV FLASK_APP=main.py
EXPOSE 8080

CMD ["gunicorn","--config", "gunicorn_config.py", "main:app"]