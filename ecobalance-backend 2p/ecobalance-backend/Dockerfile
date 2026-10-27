FROM node:20-alpine

# Instala Python 3, NumPy e cria o link simbólico para "python"
RUN apk add --no-cache python3 py3-numpy && \
    ln -sf python3 /usr/bin/python

WORKDIR /app

COPY package*.json ./
RUN npm install --omit=dev

COPY . .

# Render utiliza a variável de ambiente $PORT em tempo de execução
EXPOSE 3000

CMD ["sh", "-c", "node seeders/seed.js || true; node server.js"]
