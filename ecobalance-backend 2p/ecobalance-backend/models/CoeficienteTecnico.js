const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Tabela coeficientes_tecnicos do artigo (particionada por ano_referencia)
const CoeficienteTecnico = sequelize.define('CoeficienteTecnico', {
  id_setor:         { type: DataTypes.INTEGER, primaryKey: true },
  nome_setor:       { type: DataTypes.STRING(50), allowNull: false },
  ano_referencia:   { type: DataTypes.INTEGER, primaryKey: true },
  valor_coeficiente:{ type: DataTypes.DECIMAL(10, 6), allowNull: false },
}, {
  tableName: 'coeficientes_tecnicos',
  timestamps: false,
});

module.exports = CoeficienteTecnico;
