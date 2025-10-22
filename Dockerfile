# Dockerfile con arquitectura específica
FROM --platform=linux/amd64 node:18-alpine as build-stage

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY . .

ARG VITE_API_URL=http://130.1.1.7:8002
ENV VITE_API_URL=$VITE_API_URL

RUN npm run build

FROM --platform=linux/amd64 nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
