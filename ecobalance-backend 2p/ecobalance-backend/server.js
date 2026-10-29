require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { sequelize } = require('./models');
const routes = require('./routes');

const app = express();
const PORTA = process.env.PORT || 3000;

// ---------- Configuração Robusta de CORS ----------
// Suporta múltiplas origens separadas por vírgula em APP_ORIGIN
const origensPermitidas = process.env.APP_ORIGIN
  ? process.env.APP_ORIGIN.split(',').map((origem) => origem.trim())
  : ['http://localhost:8080', 'http://127.0.0.1:8080', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Permite requisições sem origin (ex.: curl, mobile apps ou healthchecks do Render)
      if (!origin || origensPermitidas.includes('*') || origensPermitidas.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error(`Bloqueado por CORS: Origem ${origin} não autorizada.`));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

// Responde imediatamente às requisições preflight OPTIONS
app.options('*', cors());

// ---------- Middlewares ----------
app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Log de requisições
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
  .sync({ alter: process.env.NODE_ENV !== 'production' }) // Evita alterações destrutivas em produção
  .then(() => console.log('✔ Banco de dados sincronizado com sucesso'))
  .catch((erro) => console.error('✖ Erro ao sincronizar:', erro.message));

// Obrigatório '0.0.0.0' para o Render rotear requisições externas para o container
app.listen(PORTA, '0.0.0.0', () => {
  console.log(`Servidor EcoBalance Ledger rodando na porta ${PORTA}`);
});
