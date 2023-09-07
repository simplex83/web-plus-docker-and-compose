FROM node:16-alpine AS builder
WORKDIR /app   
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . ./
RUN npm run build \
    && rm -rf ./src \
    && rm -rf ./node_modules

FROM nginx:1.23.1-alpine AS frontend
WORKDIR /app
COPY --from=builder /app/build /usr/share/nginx/html
COPY --from=builder /app/nginx/conf.d /etc/nginx/conf.d
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]