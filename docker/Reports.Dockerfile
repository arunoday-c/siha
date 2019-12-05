FROM node:12.13.0-alpine
ENV CHROME_BIN="/usr/bin/chromium-browser"\
    PUPPETEER_SKIP_CHROMIUM_DOWNLOAD="true"
RUN echo @edge http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories && \
    echo @edge http://nl.alpinelinux.org/alpine/edge/main >> /etc/apk/repositories && \
    apk add --no-cache \
    chromium \
    nss
WORKDIR /app
COPY ./package.json /app/package.json
RUN npm install
RUN npm install --no-save puppeteer@1.13.0
RUN npm i -g pm2
COPY ["./algaeh_report_tool", "./algaeh_report_tool"]
COPY ["./build", "./build"]
CMD source /run/secrets/all_env && env && NODE_ENV=production npm run run-docker