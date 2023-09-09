# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /var/www/html

COPY --from=build-stage /app/nginx/nginx.conf /etc/nginx/nginx.conf
COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d/default.conf

# make all files belong to the nginx user
RUN chown nginx:nginx /var/www/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]