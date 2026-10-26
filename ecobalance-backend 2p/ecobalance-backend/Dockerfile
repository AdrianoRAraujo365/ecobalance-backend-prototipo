FROM node:20-alpine

# Python + NumPy para o motor de Leontief (artigo)
RUN apk add --no-cache python3 py3-numpy

WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .

EXPOSE 3000
CMD ["sh", "-c", "node seeders/seed.js && node server.js"]
