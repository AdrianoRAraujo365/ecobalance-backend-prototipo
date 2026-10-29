// Seed — popula o banco com os dados das Tabelas 1 e 2 do artigo (2015–2026)
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, Usuario, IndicadorESG, CoeficienteTecnico, DemandaFinal, LogBlockchain } = require('../models');
const { gerarHashBloco, hashGenesis } = require('../utils/hash');

const INDICADORES = [
  { ano: 2015, eficiencia_energetica: 0.65, emissoes_co2_escopo2: 1200, roi_sustentavel: 4.2,  conformidade: 'Não Conforme',     status_blockchain: 'Ausente' },
  { ano: 2018, eficiencia_energetica: 0.69, emissoes_co2_escopo2: 1120, roi_sustentavel: 6.1,  conformidade: 'Parcial',          status_blockchain: 'Simulação Inicial' },
  { ano: 2021, eficiencia_energetica: 0.74, emissoes_co2_escopo2: 980,  roi_sustentavel: 9.8,  conformidade: 'Parcial',          status_blockchain: 'Verificado' },
  { ano: 2024, eficiencia_energetica: 0.79, emissoes_co2_escopo2: 860,  roi_sustentavel: 12.5, conformidade: 'Conforme',         status_blockchain: 'Verificado' },
  { ano: 2026, eficiencia_energetica: 0.81, emissoes_co2_escopo2: 820,  roi_sustentavel: 14.2, conformidade: 'Conforme (Pleno)', status_blockchain: 'Ledger Ativo (SHA-256)' },
];

// Tabela 2 — variação setorial 2015 vs 2026 (coeficientes c_ij por setor/ano)
const SETORES = [
  { id: 1, nome: 'TI Verde',               c2015: 0.350, c2026: 0.210 },
  { id: 2, nome: 'Energia Elétrica',       c2015: 0.280, c2026: 0.240 },
  { id: 3, nome: 'Indústria / Manufatura', c2015: 0.450, c2026: 0.410 },
  { id: 4, nome: 'Transportes / Logística',c2015: 0.150, c2026: 0.120 },
];

// Demanda final d por setor/ano (exemplo operacional para o motor)
const DEMANDA = [
  { id_setor: 1, ano: 2026, valor: 2.0 },
  { id_setor: 2, ano: 2026, valor: 1.5 },
  { id_setor: 3, ano: 2026, valor: 0.8 },
  { id_setor: 4, ano: 2026, valor: 1.2 },
];

async function seed() {
  await sequelize.sync({ alter: true });

  // Usuário admin (senha nunca em texto puro — bcrypt)
  const senhaHash = await bcrypt.hash('admin123', 10);
  await Usuario.findOrCreate({
    where: { email: 'admin@ecobalance.com' },
    defaults: { nome: 'Administrador', senha: senhaHash, tipo: 'admin' },
  });

  await IndicadorESG.bulkCreate(INDICADORES, { updateOnDuplicate: ['eficiencia_energetica', 'emissoes_co2_escopo2', 'roi_sustentavel', 'conformidade', 'status_blockchain'] });

  for (const s of SETORES) {
    await CoeficienteTecnico.upsert({ id_setor: s.id, nome_setor: s.nome, ano_referencia: 2015, valor_coeficiente: s.c2015 });
    await CoeficienteTecnico.upsert({ id_setor: s.id, nome_setor: s.nome, ano_referencia: 2026, valor_coeficiente: s.c2026 });
  }

  for (const d of DEMANDA) {
    await DemandaFinal.upsert(d);
  }

  // Gênesis do ledger: registra o indicador-chave de cada ano, encadeando hashes
  let hashAnterior = hashGenesis();
  for (const ind of INDICADORES) {
    const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const hash = gerarHashBloco({
      idIndicadorGri: 'GRI-305-1',
      valorCalculado: ind.emissoes_co2_escopo2,
      hashAnterior,
      timestamp,
    });
    await LogBlockchain.findOrCreate({
      where: { hash_verificacao: hash },
      defaults: {
        id_indicador_gri: 'GRI-305-1',
        valor_calculado: ind.emissoes_co2_escopo2,
        hash_anterior: hashAnterior,
        hash_verificacao: hash,
        status_auditoria: 'verificado',
      },
    });
    hashAnterior = hash;
  }

  console.log('✔ Seed concluído — admin@ecobalance.com / admin123');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
