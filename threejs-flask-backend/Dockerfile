# FROM python:3.9
FROM ubuntu

WORKDIR /asteroids

VOLUME /tables

RUN apt-get update
RUN apt-get -y install python3.9
RUN apt-get -y install python3-pip

#COPY . ./threejs-flask-backend
COPY . .

RUN pip install -e .

ENV FLASK_APP threejs-flask-backend
ENV FLASK_ENV development

VOLUME /tables

EXPOSE 5000

#ENTRYPOINT ["python", "-m", "flask", "run", "--host=0.0.0.0"]
ENTRYPOINT ["flask", "run", "--host=0.0.0.0"]

#  docker build . -t rsilver1/flask-backend-snake
# docker run -d -p 5000:5000 --name test-flask-backend -v /flask-backend-snake/tables:/asteroids/tables rsilver1/flask-backend-snake






