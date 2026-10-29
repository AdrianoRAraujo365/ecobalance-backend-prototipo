-- Criação da tabela para registros ESG (CRUD PostgreSQL)
CREATE TABLE IF NOT EXISTS registros_esg (
    id SERIAL PRIMARY KEY,
    empresa VARCHAR(150) NOT NULL,
    setor VARCHAR(80) NOT NULL,
    co2 NUMERIC(10, 2) NOT NULL,
    data_registro DATE DEFAULT CURRENT_DATE
);

-- Criação da tabela de auditoria (Registro Criptográfico Encadeado SHA-256)
CREATE TABLE IF NOT EXISTS ledger_chain (
    id SERIAL PRIMARY KEY,
    operacao VARCHAR(255) NOT NULL,
    hash_atual CHAR(64) NOT NULL,
    hash_anterior CHAR(64) NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Carga demonstrativa inicial dos dados do EnGeTec 2026
INSERT INTO registros_esg (empresa, setor, co2, data_registro) VALUES
('EcoCloud Ltda (11.222.333/0001-11)', 'Cloud', 28.40, '2026-06-12'),
('GreenServer S.A. (44.555.666/0001-22)', 'TI Verde', 12.10, '2026-06-14'),
('DataMatrix Corp (99.888.777/0001-33)', 'Hardware', 54.90, '2026-06-15');

INSERT INTO ledger_chain (id, operacao, hash_atual, hash_anterior) VALUES
(1, 'Carga Inicial Coeficientes A', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855', '0000000000000000000000000000000000000000000000000000000000000000'),
(2, 'Simulação Insumo-Produto Setorial', '8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855');