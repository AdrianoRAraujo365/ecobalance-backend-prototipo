// Equivalente puro-JS do motor Python — usado como fallback e nos testes unitários
function invert(matrix) {
  const n = matrix.length;
  const a = matrix.map((row, i) => [...row, ...Array.from({ length: n }, (_, j) => (i === j ? 1 : 0))]);
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[maxRow][col])) maxRow = row;
    }
    [a[col], a[maxRow]] = [a[maxRow], a[col]];
    const pivot = a[col][col];
    if (Math.abs(pivot) < 1e-12) throw new Error('Matriz singular');
    for (let j = 0; j < 2 * n; j++) a[col][j] /= pivot;
    for (let row = 0; row < n; row++) {
      if (row === col) continue;
      const factor = a[row][col];
      for (let j = 0; j < 2 * n; j++) a[row][j] -= factor * a[col][j];
    }
  }
  return a.map((row) => row.slice(n));
}

function determinant(matrix) {
  const n = matrix.length;
  const a = matrix.map((r) => [...r]);
  let det = 1;
  for (let col = 0; col < n; col++) {
    let maxRow = col;
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(a[row][col]) > Math.abs(a[maxRow][col])) maxRow = row;
    }
    if (maxRow !== col) { [a[col], a[maxRow]] = [a[maxRow], a[col]]; det *= -1; }
    det *= a[col][col];
    if (Math.abs(a[col][col]) < 1e-12) return 0;
    for (let row = col + 1; row < n; row++) {
      const factor = a[row][col] / a[col][col];
      for (let j = col; j < n; j++) a[row][j] -= factor * a[col][j];
    }
  }
  return det;
}

function calcularLeontief(C, d) {
  const n = C.length;
  const L = C.map((row, i) => row.map((v, j) => (i === j ? 1 - v : -v)));
  const det = determinant(L);
  if (det <= 0) {
    return { status: 'error', message: 'Sistema Improdutivo: Det(I-A) <= 0 (Violação Hawkins-Simons)' };
  }
  const inversa = invert(L);
  const producaoTotal = inversa.map((row) => row.reduce((acc, v, j) => acc + v * d[j], 0));
  return { status: 'success', producaoTotal, determinante: det, inversa };
}

/** Sensibilidade: ΔX = (I - C - ΔB)^-1 · d - X0 (calculadora marginalista do artigo) */
function simularSensibilidade(C, d, deltaB) {
  const Cmod = C.map((row) => row.map((v) => v));
  Object.entries(deltaB).forEach(([idx, reducao]) => {
    for (let i = 0; i < Cmod.length; i++) Cmod[i][idx] = Math.max(0, Cmod[i][idx] * (1 - reducao));
  });
  const base = calcularLeontief(C, d);
  const mod = calcularLeontief(Cmod, d);
  if (base.status !== 'success' || mod.status !== 'success') return { status: 'error', message: mod.message };
  const deltaX = mod.producaoTotal.map((x, i) => x - base.producaoTotal[i]);
  const deltaXPerc = base.producaoTotal.map((x0, i) => (x0 !== 0 ? ((mod.producaoTotal[i] - x0) / x0) * 100 : 0));
  return { status: 'success', producaoBase: base.producaoTotal, producaoMod: mod.producaoTotal, deltaX, deltaXPerc };
}

module.exports = { calcularLeontief, simularSensibilidade, invert, determinant };

// Teste unitário standalone (npm run test:leontief)
if (require.main === module) {
  const C = [[0.21, 0.12], [0.15, 0.24]];
  const d = [1000, 1500];
  const r = calcularLeontief(C, d);
  console.log(JSON.stringify(r, null, 2));
  const s = simularSensibilidade(C, d, { 0: 0.1 });
  console.log('Sensibilidade (Hardware -10%):', JSON.stringify(s.deltaXPerc));
}
