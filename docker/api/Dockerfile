FROM node:14.15.4-alpine3.12

RUN apk update
RUN apk add git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add python dependency for node-pre-gyp in order to build sqlite3 package
ENV PYTHONUNBUFFERED=1
RUN apk add --update alpine-sdk
RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
RUN python3 -m ensurepip
RUN pip3 install --no-cache --upgrade pip setuptools

# .env must be at WORKDIR to be found by dotenv package
RUN git clone https://github.com/davidpoza/wheimo.git .
WORKDIR /usr/src/app/api
COPY .env .
COPY ./docker/api/start.sh .
RUN ls -la
RUN chmod +x start.sh
# RUN chown -R node:node .
# USER node
RUN npm i


EXPOSE 3000

CMD [ "./start.sh" ]