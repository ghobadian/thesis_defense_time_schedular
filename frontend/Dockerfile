FROM node:18-alpine AS build
WORKDIR /app

# Build argument
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
ARG NGINX_CONF=nginx-prod.conf
COPY --from=build /app/build /usr/share/nginx/html
COPY ${NGINX_CONF} /etc/nginx/conf.d/default.conf
EXPOSE 80 443
CMD ["nginx", "-g", "daemon off;"]
