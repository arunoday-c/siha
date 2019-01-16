FROM node:latest
WORKDIR /apps
COPY package.json /apps/package.json
COPY package-lock.json /apps/package-lock.json
RUN npm install
COPY . /apps
RUN cd ./keys && npm link && cd .. && cd ./AlgaehUtilities && npm link algaeh-keys && npm link && cd ..
RUN cd ./HrManagement && npm link algaeh-keys && npm link algaeh-utilities && cd ..
RUN cd ./DocumentManagement && npm install && npm link algaeh-keys && cd ..
CMD ["npm","run","api"]