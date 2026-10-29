// Centralizador de rotas da API REST (prefixo /api)
const express = require('express');
const router = express.Router();

router.get('/health', (req, res) => res.json({
  status: 'ok',
  servico: 'EcoBalance Ledger API',
  versao: '2.0.26',
  engine: 'Leontief (I-C)^-1 · d',
}));

router.use('/auth', require('./api/authApi'));
router.use('/leontief', require('./api/leontiefApi'));
router.use('/esg', require('./api/esgApi'));
router.use('/blockchain', require('./api/blockchainApi'));
router.use('/dashboard', require('./api/dashboardApi'));

module.exports = router;
