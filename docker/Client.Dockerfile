FROM node:12.13.0-alpine
WORKDIR /var/www
RUN npm init -y && npm i express
COPY ./server.js ./server.js
COPY ["./build", "./build"]
CMD ["node","server.js"]