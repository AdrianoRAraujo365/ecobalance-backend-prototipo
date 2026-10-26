const express = require('express');
const router = express.Router();
const indicadorController = require('../../controllers/indicadorController');

router.get('/evolucao', indicadorController.evolucao);
router.get('/coeficientes', indicadorController.coeficientes);
router.get('/matriz', indicadorController.matriz);

module.exports = router;
