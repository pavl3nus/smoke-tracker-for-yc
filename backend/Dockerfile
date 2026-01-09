FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client wget bash

RUN mkdir -p /app/.postgresql && \
    wget "https://storage.yandexcloud.net/cloud-certs/CA.pem" \
         --output-document /app/.postgresql/root.crt && \
    chmod 0655 /app/.postgresql/root.crt

RUN npm install -g nodemon

COPY package*.json ./
RUN npm install

RUN npm install tsx -D

COPY . .

EXPOSE 8000

CMD ["npm", "run", "dev"]