FROM node:22-alpine AS builder

ARG VITE_APP_VERSION
WORKDIR /app

ENV VITE_APP_BUILD_SOURCE=docker
ENV VITE_APP_VERSION=$VITE_APP_VERSION

COPY . .
RUN npm ci && npm run build

# production environment
FROM nginx:alpine AS server

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx/conf/nginx.conf /etc/nginx/conf.d/default.conf
COPY nginx/docker/50-substitute-env-variables.sh /docker-entrypoint.d/
RUN chmod +x /docker-entrypoint.d/50-substitute-env-variables.sh

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]