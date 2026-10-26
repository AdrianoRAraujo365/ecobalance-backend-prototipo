// Orquestra o motor matemático: tenta Python/NumPy via child_process
// (como descrito no artigo) e faz fallback transparente para o motor JS puro.
const { execFile } = require('child_process');
const path = require('path');
const jsEngine = require('../scripts/leontief_engine');

const PYTHON_SCRIPT = path.join(__dirname, '..', 'scripts', 'leontief_engine.py');

function rodarPython(C, d) {
  return new Promise((resolve, reject) => {
    execFile(
      'python3',
      [PYTHON_SCRIPT, JSON.stringify(C), JSON.stringify(d)],
      { timeout: 5000 },
      (erro, stdout) => {
        if (erro) return reject(erro);
        try { resolve(JSON.parse(stdout)); } catch (e) { reject(e); }
      }
    );
  });
}

async function calcular(C, d) {
  try {
    const r = await rodarPython(C, d);
    if (r.status === 'success') {
      return { ...r, engine: 'python-numpy' };
    }
    return { ...jsEngine.calcularLeontief(C, d), engine: 'js-fallback', aviso: r.message };
  } catch {
    return { ...jsEngine.calcularLeontief(C, d), engine: 'js-fallback' };
  }
}

async function sensibilidade(C, d, deltaB) {
  // Motor JS (rápido, determinístico) para a calculadora marginalista
  const r = jsEngine.simularSensibilidade(C, d, deltaB);
  return { ...r, engine: 'js-fallback' };
}

module.exports = { calcular, sensibilidade };
