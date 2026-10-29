# leontief_engine.py — Motor Insumo-Produto (artigo EcoBalance Ledger)
# Equivalente NumPy ao módulo descrito na metodologia do artigo.
# Pode ser executado standalone (testes) ou via child_process do Node.js:
#   python3 leontief_engine.py '[[0.21,0.12],[0.15,0.24]]' '[1000,1500]'
import json
import sys
import numpy as np

def calcular_matriz_leontief(matriz_coeficientes, demanda_final):
    """Retorna o vetor de produção total X baseado na Inversa de Leontief
    e valida a condição de produtividade de Hawkins-Simons."""
    A = np.array(matriz_coeficientes, dtype=float)
    d = np.array(demanda_final, dtype=float)
    I = np.eye(A.shape[0])

    # Matriz de Leontief (I - A)
    L = I - A

    # Validação do Determinante (Condição de Hawkins-Simons)
    det = np.linalg.det(L)
    if det <= 0:
        return {
            "status": "error",
            "message": "Sistema Improdutivo: Det(I-A) <= 0 (Violação Hawkins-Simons)",
        }

    # Inversa de Leontief: (I - A)^(-1)
    leontief_inverse = np.linalg.inv(L)

    # Produção Total Necessária: X = (I - A)^(-1) * d
    X = np.dot(leontief_inverse, d)

    return {
        "status": "success",
        "producao_total": X.tolist(),
        "inversa": leontief_inverse.tolist(),
        "determinante": float(det),
    }

if __name__ == "__main__":
    if len(sys.argv) == 3:
        coef = json.loads(sys.argv[1])
        demanda = json.loads(sys.argv[2])
    else:
        # Exemplo padrão (execução via Node.js child_process)
        coef = [[0.21, 0.12], [0.15, 0.24]]
        demanda = [1000, 1500]

    resultado = calcular_matriz_leontief(coef, demanda)
    print(json.dumps(resultado))
