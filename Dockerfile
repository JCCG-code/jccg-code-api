# 1. Usar una imagen base oficial de Node.js (versión Alpine)
FROM node:22.16.0-alpine3.22

# 2. Crear y establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# 3. Copiar los archivos de definición de dependencias
# Copia package.json y pnpm-lock.yaml
COPY package.json ./
COPY pnpm-lock.yaml ./

# 4. Instalar las dependencias de producción usando pnpm
RUN corepack enable
RUN pnpm install --prod --frozen-lockfile

# 5. Copiar el resto del código de la aplicación al directorio de trabajo
COPY . .

# 6. Exponer el puerto en el que la aplicación se ejecuta dentro del contenedor
EXPOSE 3000

# 7. Definir el comando para ejecutar la aplicación cuando se inicie el contenedor
CMD [ "node", "index.js" ]