FROM node:lts-slim
WORKDIR /usr/app
USER root

RUN apt-get update
RUN apt-get install -y git

COPY app.js ./
COPY package*.json ./
RUN mkdir app
COPY app/ ./app/
RUN npm install

CMD [ "npm run start-in-docker" ]
