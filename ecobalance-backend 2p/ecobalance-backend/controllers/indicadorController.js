const { IndicadorESG, CoeficienteTecnico, DemandaFinal } = require('../models');

// GET /api/esg/evolucao — Tabela 1 do artigo (série decenal)
async function evolucao(req, res) {
  try {
    const dados = await IndicadorESG.findAll({ order: [['ano', 'ASC']] });
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar indicadores', detalhes: erro.message });
  }
}

// GET /api/esg/coeficientes?ano=2026 — série temporal de c_ij por setor
async function coeficientes(req, res) {
  try {
    const where = req.query.ano ? { ano_referencia: req.query.ano } : {};
    const dados = await CoeficienteTecnico.findAll({ where, order: [['id_setor', 'ASC'], ['ano_referencia', 'ASC']] });
    res.json(dados);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar coeficientes', detalhes: erro.message });
  }
}

// GET /api/esg/matriz?ano=2026 — monta C e d do ano para o app React Native
async function matriz(req, res) {
  try {
    const ano = parseInt(req.query.ano) || 2026;
    const coefs = await CoeficienteTecnico.findAll({ where: { ano_referencia: ano }, order: [['id_setor', 'ASC']] });
    const demandas = await DemandaFinal.findAll({ where: { ano_referencia: ano }, order: [['id_setor', 'ASC']] });

    const setores = [...new Set(coefs.map((c) => c.id_setor))];
    const C = setores.map((id) => coefs.filter((c) => c.id_setor === id).sort((a, b) => a.nome_setor.localeCompare(b.nome_setor)).map((c) => parseFloat(c.valor_coeficiente)));
    const d = demandas.map((dm) => parseFloat(dm.valor_demanda));
    const nomes = [...new Set(coefs.map((c) => c.nome_setor))];

    res.json({ ano, setores: nomes, C, d });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao montar matriz', detalhes: erro.message });
  }
}

module.exports = { evolucao, coeficientes, matriz };
