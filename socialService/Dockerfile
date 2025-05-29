FROM node:18

# Establecer directorio de trabajo
WORKDIR /app

# Copiar y instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer puerto gRPC
EXPOSE 50054

# Comando por defecto
CMD ["npm", "start"]
