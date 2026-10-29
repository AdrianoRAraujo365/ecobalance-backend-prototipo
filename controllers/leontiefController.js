// Motor Insumo-Produto — X = (I - C)^-1 · d, validação Hawkins-Simons
const leontiefService = require('../services/leontiefService');
const { Simulacao } = require('../models');

async function calcular(req, res) {
  try {
    const { C, d } = req.body;
    if (!Array.isArray(C) || !Array.isArray(d) || C.length === 0 || C.length !== d.length) {
      return res.status(400).json({ erro: 'Envie a matriz C (n×n) e o vetor d (n) válidos' });
    }
    const resultado = await leontiefService.calcular(C, d);
    if (resultado.status === 'error') return res.status(422).json(resultado);
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no cálculo de Leontief', detalhes: erro.message });
  }
}

// Calculadora de sensibilidade marginalista — ΔX = (I - C - ΔB)^-1 · d - X0
async function sensibilidade(req, res) {
  try {
    const { C, d, deltaB } = req.body;
    const resultado = await leontiefService.sensibilidade(C, d, deltaB || {});
    if (resultado.status === 'error') return res.status(422).json(resultado);

    // Persiste a simulação para auditoria (usuário vem do JWT)
    if (req.usuario) {
      await Simulacao.create({
        usuario_id: req.usuario.id,
        parametros: { C, d, deltaB },
        resultado,
      });
    }
    res.json(resultado);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro na simulação de sensibilidade', detalhes: erro.message });
  }
}

module.exports = { calcular, sensibilidade };
