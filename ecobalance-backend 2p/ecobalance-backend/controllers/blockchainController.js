// Ledger imutável SHA-256 encadeado (artigo) — registros + auditoria de integridade
const { LogBlockchain } = require('../models');
const { gerarHashBloco, hashGenesis, verificarCadeia } = require('../utils/hash');

// POST /api/blockchain/registrar — cria novo bloco encadeado
async function registrar(req, res) {
  try {
    const { id_indicador_gri, valor_calculado } = req.body;
    if (!id_indicador_gri || valor_calculado === undefined) {
      return res.status(400).json({ erro: 'id_indicador_gri e valor_calculado são obrigatórios' });
    }

    const ultimo = await LogBlockchain.findOne({ order: [['id_hash', 'DESC']] });
    const hashAnterior = ultimo ? ultimo.hash_verificacao : hashGenesis();
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hashVerificacao = gerarHashBloco({
      idIndicadorGri: id_indicador_gri,
      valorCalculado: valor_calculado,
      hashAnterior,
      timestamp,
    });

    const bloco = await LogBlockchain.create({
      id_indicador_gri,
      valor_calculado,
      hash_anterior: hashAnterior,
      hash_verificacao: hashVerificacao,
      status_auditoria: 'verificado',
    });

    res.status(201).json(bloco);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao registrar transação', detalhes: erro.message });
  }
}

// GET /api/blockchain/logs — histórico (público para leitura)
async function logs(req, res) {
  try {
    const limite = Math.min(parseInt(req.query.limite) || 50, 200);
    const blocos = await LogBlockchain.findAll({ order: [['id_hash', 'DESC']], limit: limite });
    res.json(blocos);
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao buscar logs', detalhes: erro.message });
  }
}

// GET /api/blockchain/auditar — verifica integridade da cadeia inteira (anti-greenwashing)
async function auditar(req, res) {
  try {
    const blocos = await LogBlockchain.findAll({ order: [['id_hash', 'ASC']] });
    const resultado = verificarCadeia(blocos.map((b) => b.toJSON()));
    res.json({
      totalBlocos: blocos.length,
      ...resultado,
      mensagem: resultado.valido
        ? 'Cadeia íntegra — zero alterações não autorizadas desde 2015'
        : `Cadeia QUEBRADA no bloco #${resultado.quebradoEm}`,
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro na auditoria', detalhes: erro.message });
  }
}

module.exports = { registrar, logs, auditar };
