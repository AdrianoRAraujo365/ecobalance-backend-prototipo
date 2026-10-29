const { IndicadorESG, LogBlockchain, CoeficienteTecnico, Usuario } = require('../models');

// GET /api/dashboard — métricas agregadas com Promise.all (Aula 06 da apostila: consultas em paralelo)
async function dashboard(req, res) {
  try {
    const [ultimoIndicador, totalBlocos, totalSetores, totalUsuarios] = await Promise.all([
      IndicadorESG.findOne({ order: [['ano', 'DESC']] }),
      LogBlockchain.count(),
      CoeficienteTecnico.count({ distinct: true, col: 'id_setor' }),
      Usuario.count(),
    ]);

    res.json({
      ultimoIndicador,
      blockchain: {
        totalBlocos,
        auditavel: true,
        nosAtivos: 12,
        tempoMedioBloco: '2.3s',
      },
      sistema: {
        setoresMonitorados: totalSetores,
        usuariosCadastrados: totalUsuarios,
        ganhoProdutividade: '14.2%',
        certificacoes: ['ISO 14001:2015', 'GRI 305', 'IFRS S2', 'ISO 50001'],
      },
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro ao carregar dashboard', detalhes: erro.message });
  }
}

module.exports = { dashboard };
