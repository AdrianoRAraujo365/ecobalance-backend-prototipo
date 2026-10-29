const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

// Tabela 1 do artigo — Evolução Decenal dos Indicadores
const IndicadorESG = sequelize.define('IndicadorESG', {
  ano:                  { type: DataTypes.INTEGER, primaryKey: true },
  eficiencia_energetica:{ type: DataTypes.DECIMAL(4, 2), allowNull: false },
  emissoes_co2_escopo2: { type: DataTypes.INTEGER, allowNull: false },       // tCO2e
  roi_sustentavel:      { type: DataTypes.DECIMAL(5, 2), allowNull: false }, // %
  conformidade:         { type: DataTypes.STRING(40), allowNull: false },
  status_blockchain:    { type: DataTypes.STRING(40), allowNull: false },
}, { tableName: 'indicadores_esg', timestamps: false });

module.exports = IndicadorESG;
