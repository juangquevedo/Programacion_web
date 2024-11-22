# Usa una imagen base de Node.js
FROM node:21

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos necesarios
COPY package*.json ./
COPY . .

# Instala las dependencias
RUN npm install

# Expone el puerto de la app
EXPOSE 3000

# Comando para iniciar el servidor
CMD ["npm", "run", "dev"]