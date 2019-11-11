FROM node:12.13.0-alpine
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install --production
COPY ["./build", "."]
CMD ["npm","run","run-docker"]