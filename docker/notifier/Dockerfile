FROM node:14.15.4-alpine3.12

RUN apk update
RUN apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# .env must be at WORKDIR to be found by dotenv package
RUN git clone https://github.com/davidpoza/wheimo.git .
WORKDIR /usr/src/app/notifier
COPY .env .
RUN npm i


EXPOSE 3000

CMD [ "npm", "run", "start-dev" ]