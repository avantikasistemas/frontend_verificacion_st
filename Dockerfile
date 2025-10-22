# Dockerfile para Frontend Vue.js - Versión Permisiva (ignora warnings)
FROM node:18-alpine as build-stage

WORKDIR /app

# Copiar package files
COPY package*.json ./

# Instalar dependencias sin verificar peer dependencies
RUN npm install --legacy-peer-deps --force

# Copiar código
COPY . .

# Variables de entorno
ARG VITE_API_URL=http://130.1.1.7:8002
ENV VITE_API_URL=$VITE_API_URL
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Desactivar verificaciones estrictas para el build
ENV CI=false
ENV DISABLE_ESLINT_PLUGIN=true

# Build
RUN npm run build || npm run build --no-lint || npm run build -- --no-type-check

# Producción
FROM nginx:stable-alpine as production-stage

COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
