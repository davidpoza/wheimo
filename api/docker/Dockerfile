FROM node:14.15.4-alpine3.12

RUN apk update
RUN apk add git

WORKDIR /usr/src/app
RUN git clone https://github.com/davidpoza/wheimo.git .
COPY .env ./api
RUN chown -R node:node .

USER node
RUN cd api && npm install --only=production

EXPOSE 4321

RUN node api/scripts/db-init.js
CMD [ "node", "api/src/app.js" ]