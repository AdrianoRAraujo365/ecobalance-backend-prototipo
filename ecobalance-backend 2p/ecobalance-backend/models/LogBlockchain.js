const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Ledger imutável do artigo — logs_transacoes_blockchain
const LogBlockchain = sequelize.define('LogBlockchain', {
  id_hash: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  id_indicador_gri: { type: DataTypes.STRING(20), allowNull: false },
  valor_calculado:  { type: DataTypes.DECIMAL(18, 4), allowNull: false },
  hash_anterior:    { type: DataTypes.STRING(255), allowNull: false },
  hash_verificacao: { type: DataTypes.STRING(255), allowNull: false },
  status_auditoria: {
    type: DataTypes.ENUM('pendente', 'verificado', 'alerta'),
    defaultValue: 'verificado',
  },
}, {
  tableName: 'logs_transacoes_blockchain',
  timestamps: true,
  createdAt: 'timestamp_registro',
  updatedAt: false,
});

module.exports = LogBlockchain;
