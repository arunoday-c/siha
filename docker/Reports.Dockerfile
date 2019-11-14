FROM node:12.13.0-alpine
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install
RUN npm i -g pm2
COPY ["./algaeh_report_tool", "./algaeh_report_tool"]
COPY ["./build", "./build"]
CMD source /run/secrets/all_env && env && NODE_ENV=production npm run run-docker