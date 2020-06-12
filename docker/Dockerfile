FROM node:12.13.0-alpine
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install --production
COPY ["./build", "./build"]
CMD source /run/secrets/all_env && env && NODE_ENV=production npm run run-docker