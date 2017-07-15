FROM tiangolo/uwsgi-nginx-flask:flask-python3.5

COPY ./app /app

ADD requirements.txt /app

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt