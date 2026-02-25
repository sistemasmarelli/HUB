# Use a imagem base do Node.js
FROM node:22

# Defina o diretório de trabalho dentro do container
WORKDIR /app

# Copie o arquivo package.json e package-lock.json para o diretório de trabalho
COPY package*.json ./

# Instale o Angular CLI globalmente
#RUN npm install -g @angular/cli@18.0.1

# Instale as dependências da aplicação
#RUN npm install

# Copie todo o código-fonte da aplicação para o diretório de trabalho
COPY . .

# Exponha a porta que o Angular usará
EXPOSE 4204
