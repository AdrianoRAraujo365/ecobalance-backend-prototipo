-- =============================================================
-- EcoBalance Ledger — Schema MySQL 8.0 (conforme artigo ABNT 2020)
-- Auditoria Criptográfica ESG e Ledger Imutável
-- =============================================================
CREATE DATABASE IF NOT EXISTS ecobalance_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecobalance_db;

-- Ledger imutável: hashes SHA-256 encadeados (hash_anterior -> hash_verificacao)
CREATE TABLE IF NOT EXISTS logs_transacoes_blockchain (
  id_hash INT AUTO_INCREMENT PRIMARY KEY,
  timestamp_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  id_indicador_gri VARCHAR(20) NOT NULL,           -- ex: 'GRI-305-1', 'IFRS-S2', 'GRI-306'
  valor_calculado DECIMAL(18,4) NOT NULL,
  hash_anterior VARCHAR(255) NOT NULL,
  hash_verificacao VARCHAR(255) NOT NULL,          -- SHA-256 gerado na transação
  status_auditoria ENUM('pendente','verificado','alerta') DEFAULT 'verificado'
) ENGINE=InnoDB;

-- Coeficientes técnicos c_ij por setor e ano (série temporal 2015-2026)
CREATE TABLE IF NOT EXISTS coeficientes_tecnicos (
  id_setor INT NOT NULL,
  nome_setor VARCHAR(50) NOT NULL,
  ano_referencia INT NOT NULL,
  valor_coeficiente DECIMAL(10,6) NOT NULL,
  PRIMARY KEY (id_setor, ano_referencia),
  INDEX (ano_referencia)
) ENGINE=InnoDB;

-- Vetor de demanda final d por setor e ano
CREATE TABLE IF NOT EXISTS demanda_final (
  id_setor INT NOT NULL,
  ano_referencia INT NOT NULL,
  valor_demanda DECIMAL(18,4) NOT NULL,
  PRIMARY KEY (id_setor, ano_referencia)
) ENGINE=InnoDB;

-- Indicadores ESG decenais (Tabela 1 do artigo)
CREATE TABLE IF NOT EXISTS indicadores_esg (
  ano INT PRIMARY KEY,
  eficiencia_energetica DECIMAL(4,2) NOT NULL,     -- índice PUE
  emissoes_co2_escopo2 INT NOT NULL,               -- tCO2e
  roi_sustentavel DECIMAL(5,2) NOT NULL,           -- %
  conformidade VARCHAR(40) NOT NULL,
  status_blockchain VARCHAR(40) NOT NULL
) ENGINE=InnoDB;

-- Usuários do painel / app mobile (JWT + bcrypt)
CREATE TABLE IF NOT EXISTS usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(120) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,                     -- hash bcrypt (nunca texto puro)
  tipo ENUM('admin','gestor','auditor','aluno') DEFAULT 'gestor',
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Histórico de simulações de sensibilidade (calculadora ΔX = (I-C-ΔB)^-1 · d - X0)
CREATE TABLE IF NOT EXISTS simulacoes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  parametros JSON NOT NULL,
  resultado JSON NOT NULL,
  criado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
) ENGINE=InnoDB;
