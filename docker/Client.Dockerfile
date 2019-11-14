FROM nginx:1.17.5-alpine
WORKDIR /var/www
COPY ["./build", "./build"]
COPY ./nginx-docker.conf /etc/nginx/nginx.conf
