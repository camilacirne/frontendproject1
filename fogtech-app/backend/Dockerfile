# Build stage
FROM node:18-alpine

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install --omit=dev

# Copiar código da aplicação
COPY . .

# Expor porta do servidor
EXPOSE 3001

# Comando para iniciar a aplicação
CMD ["node", "server.js"]
