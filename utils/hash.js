const crypto = require('crypto');

/**
 * Gera hash SHA-256 encadeado do ledger (artigo: hash_verificacao vinculado ao bloco anterior).
 * Mudar QUALQUER campo histórico invalida toda a cadeia — proteção contra greenwashing.
 */
function gerarHashBloco({ idIndicadorGri, valorCalculado, hashAnterior, timestamp }) {
  const payload = [idIndicadorGri, valorCalculado, hashAnterior, timestamp].join('|');
  return crypto.createHash('sha256').update(payload).digest('hex');
}

/** Hash "gênesis" para o primeiro bloco da cadeia. */
function hashGenesis() {
  return crypto.createHash('sha256').update('ECOBALANCE_LEDGER_GENESIS_2015').digest('hex');
}

/** Verifica integridade de um segmento da cadeia (auditoria externa). */
function verificarCadeia(blocos) {
  let anterior = hashGenesis();
  for (const bloco of blocos) {
    if (bloco.hash_anterior !== anterior) return { valido: false, quebradoEm: bloco.id_hash };
    const esperado = gerarHashBloco({
      idIndicadorGri: bloco.id_indicador_gri,
      valorCalculado: bloco.valor_calculado,
      hashAnterior: bloco.hash_anterior,
      timestamp: bloco.timestamp_registro,
    });
    if (bloco.hash_verificacao !== esperado) return { valido: false, quebradoEm: bloco.id_hash };
    anterior = bloco.hash_verificacao;
  }
  return { valido: true };
}

module.exports = { gerarHashBloco, hashGenesis, verificarCadeia };
