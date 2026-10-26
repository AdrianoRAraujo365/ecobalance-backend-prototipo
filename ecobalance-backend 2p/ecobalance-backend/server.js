require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORTA = process.env.PORT || 3000;

// ---------- Middlewares (ordem importa — Aula 02 da apostila) ----------
app.use(cors({ origin: process.env.APP_ORIGIN || '*' })); // CORS para o app React Native / React web
app.use(bodyParser.json({ limit: '2mb' }));               // interpreta JSON no corpo (equivalente a express.json())
app.use(bodyParser.urlencoded({ extended: true }));       // formulários

// Log simples de requisições (middleware didático da Aula 02)
app.use((req, res, next) => {
  const agora = new Date().toLocaleTimeString('pt-BR');
  console.log(`[${agora}] ${req.method} ${req.url}`);
  next();
});

// ---------- Rotas ----------
app.use('/api', routes);

// Tratamento de rotas não encontradas
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada' }));

// ---------- Sincronização do banco e subida do servidor ----------
sequelize
  .sync({ alter: true }) // cria/atualiza tabelas a partir dos Models (didático; em produção usar migrations)
  .then(() => console.log('✔ Tabelas sincronizadas com o MySQL'))
  .catch((erro) => console.error('✖ Erro ao sincronizar:', erro.message));

app.listen(PORTA, () => {
  console.log(`Servidor EcoBalance Ledger rodando em http://localhost:${PORTA}/api`);
});
