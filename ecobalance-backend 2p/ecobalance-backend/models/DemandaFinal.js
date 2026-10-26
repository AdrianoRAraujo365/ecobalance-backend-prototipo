const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const DemandaFinal = sequelize.define('DemandaFinal', {
  id_setor:       { type: DataTypes.INTEGER, primaryKey: true },
  ano_referencia: { type: DataTypes.INTEGER, primaryKey: true },
  valor_demanda:  { type: DataTypes.DECIMAL(18, 4), allowNull: false },
}, { tableName: 'demanda_final', timestamps: false });

module.exports = DemandaFinal;
