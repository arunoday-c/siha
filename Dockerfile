FROM node:8.11.1
WORKDIR /usr/src/hims
COPY package*.json ./

RUN npm install
COPY . .
CMD ["npm","run","api"]
