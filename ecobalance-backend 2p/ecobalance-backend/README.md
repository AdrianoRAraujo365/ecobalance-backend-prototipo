# EcoBalance Ledger — Backend API (Node.js + Express + Sequelize + MySQL)

Backend REST do EcoBalance Ledger, construído seguindo a arquitetura MVC da apostila
**"Sistema de Gerenciamento de Biblioteca"** (Node.js • Express • MVC • MySQL • Sequelize • JWT)
e implementando a metodologia do **artigo EcoBalance Ledger (ABNT 2020)**:
motor de Leontief `(I − C)⁻¹ · d` com validação de Hawkins-Simons, ledger blockchain SHA-256
encadeado e séries temporais 2015–2026.

## Stack
- **Node.js 20 + Express 4** — rotas REST, middlewares
- **Sequelize 6 + MySQL2** — ORM com prepared statements (anti-SQL Injection)
- **body-parser** — interpretação de JSON e formulários
- **bcryptjs + jsonwebtoken** — autenticação segura (hash de senha + sessão stateless)
- **Python 3 + NumPy** — motor de Leontief via `child_process` (com fallback JS puro)

## Estrutura (MVC)
```
config/sequelize.js       → conexão Sequelize/MySQL2
config/database.sql       → schema bruto MySQL 8.0 (ledger + coeficientes temporais)
models/                   → Usuario, CoeficienteTecnico, DemandaFinal, IndicadorESG,
                            LogBlockchain, Simulacao (+ index com relacionamentos)
controllers/              → auth, leontief, indicadores, blockchain, dashboard
middlewares/autenticar.js → JWT (Bearer) + somenteAdmin
routes/api/               → /api/auth, /api/leontief, /api/esg, /api/blockchain, /api/dashboard
services/leontiefService.js → orquestra Python/NumPy ↔ fallback JS
scripts/leontief_engine.py  → motor do artigo (NumPy + Hawkins-Simons)
scripts/leontief_engine.js  → equivalente JS puro + testes unitários
utils/hash.js             → SHA-256 encadeado (gerarHashBloco, hashGenesis, verificarCadeia)
seeders/seed.js           → Tabelas 1 e 2 do artigo + usuário admin + gênesis do ledger
```

## Como rodar

### Opção A — Docker (recomendada, conforme artigo)
```bash
cp .env.example .env   # ajuste se necessário
docker-compose up --build -d
# API em http://localhost:3000/api  •  MySQL em localhost:3306
```

### Opção B — Local
```bash
# 1. Crie o banco (opcional — o sync do Sequelize cria as tabelas)
mysql -u root -p < config/database.sql

# 2. Configure o .env
cp .env.example .env   # edite DB_PASSWORD e JWT_SECRET

# 3. Instale, popule e suba
npm install
npm run seed
npm run dev            # nodemon
```

## Endpoints da API REST

### Autenticação
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/auth/cadastrar` | Cadastra usuário (senha com bcrypt) | — |
| POST | `/api/auth/login` | Retorna JWT (8h) | — |

### Motor de Leontief
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/leontief/calcular` | `X = (I−C)⁻¹·d` com Hawkins-Simons (Python/NumPy) | — |
| POST | `/api/leontief/sensibilidade` | `ΔX = (I−C−ΔB)⁻¹·d − X₀`, persiste simulação | JWT |

Body de `/calcular`:
```json
{ "C": [[0.21, 0.12], [0.15, 0.24]], "d": [1000, 1500] }
```
Resposta (sucesso): `{ "status": "success", "producao_total": [...], "determinante": ..., "engine": "python-numpy" }`
Resposta (sistema improdutivo): `422 { "status": "error", "message": "Sistema Improdutivo: Det(I-A) <= 0..." }`

### Indicadores ESG (Tabela 1 e 2 do artigo)
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/esg/evolucao` | Série decenal 2015–2026 (PUE, CO₂, ROI, conformidade) |
| GET | `/api/esg/coeficientes?ano=2026` | Coeficientes cᵢⱼ por setor |
| GET | `/api/esg/matriz?ano=2026` | Matriz C e vetor d prontos para o app |

### Blockchain Ledger (SHA-256 encadeado)
| Método | Rota | Descrição | Auth |
|---|---|---|---|
| POST | `/api/blockchain/registrar` | Cria bloco encadeado (`id_indicador_gri`, `valor_calculado`) | JWT |
| GET | `/api/blockchain/logs` | Histórico de transações | — |
| GET | `/api/blockchain/auditar` | Verifica integridade da cadeia inteira (anti-greenwashing) | — |

### Dashboard
| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/dashboard` | Métricas agregadas via `Promise.all` (4 consultas em paralelo) |

## Exemplo de fluxo (app mobile)
```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@ecobalance.com","senha":"admin123"}' | jq -r .token)

# 2. Registra transação verde no ledger
curl -X POST http://localhost:3000/api/blockchain/registrar   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"id_indicador_gri":"GRI-305-1","valor_calculado":820.0000}'

# 3. Audita a cadeia
curl http://localhost:3000/api/blockchain/auditar
```

## Integração com o front-end
Veja `INTEGRACAO.md` no projeto React Native (`ecobalance-ledger-react-native`),
que inclui `src/services/api.js` (cliente REST com JWT) e `src/context/AuthContext.js`.

## Segurança
- Senhas com **bcrypt** (custo 10) — nunca em texto puro, nunca expostas na API
- **JWT** em rotas de escrita; escopo `admin` para ações críticas
- **Prepared statements** via Sequelize/mysql2 (anti-SQL Injection)
- Ledger SHA-256: qualquer alteração histórica invalida a cadeia (`/api/blockchain/auditar`)
- `.env` fora do Git (adicionar ao `.gitignore`)

## Autores
Adriano Rodrigues de Araujo • Gabriel Gomide • Pedro Henrique da Silva
Fatec Zona Leste — Centro Paula Souza • adriano.rodrigues365@outlook.com
