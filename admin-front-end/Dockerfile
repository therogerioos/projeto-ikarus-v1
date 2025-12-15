# Build do React
FROM node:20-alpine3.20 AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install
COPY . .
RUN npm run build

# Servir com Nginx (Alpine atualizado)
FROM nginx:1.25.6-alpine3.20
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

