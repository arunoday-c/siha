FROM node:8.11.1
WORKDIR /usr/src/hims
COPY package*.json ./
RUN npm install
COPY . .
RUN cd ./client && npm rebuild node-sass --force
CMD ["npm","run","dev"]
