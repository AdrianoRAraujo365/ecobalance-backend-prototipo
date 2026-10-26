const express = require('express');
const router = express.Router();
const { autenticar } = require('../../middlewares/autenticar');
const leontiefController = require('../../controllers/leontiefController');

router.post('/calcular', leontiefController.calcular);              // público (leitura técnica)
router.post('/sensibilidade', autenticar, leontiefController.sensibilidade); // persistido por usuário

module.exports = router;
