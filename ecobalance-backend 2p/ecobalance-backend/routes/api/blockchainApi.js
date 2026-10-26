const express = require('express');
const router = express.Router();
const { autenticar } = require('../../middlewares/autenticar');
const blockchainController = require('../../controllers/blockchainController');

router.post('/registrar', autenticar, blockchainController.registrar); // escrita protegida
router.get('/logs', blockchainController.logs);                        // leitura pública
router.get('/auditar', blockchainController.auditar);                  // auditoria de integridade

module.exports = router;
