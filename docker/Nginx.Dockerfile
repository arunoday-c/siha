FROM nginx:1.17.5-alpine
COPY ./nginx-docker.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]