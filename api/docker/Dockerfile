FROM node:14.15.4-alpine3.12

RUN apk update
RUN apk add git

# add python dependency for node-pre-gyp in order to build sqlite3 package
ENV PYTHONUNBUFFERED=1
RUN apk add --update alpine-sdk
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# .env must be at WORKDIR to be found by dotenv package
WORKDIR /usr/src/app
RUN git clone https://github.com/davidpoza/wheimo.git
RUN cp -r wheimo/api/* .
RUN rm -rf wheimo
COPY .env .
RUN ls -la
RUN ls -la
RUN chown -R node:node .

USER node
RUN npm install --only=production

EXPOSE 4321

RUN node scripts/db-init.js
CMD [ "node", "src/app.js" ]