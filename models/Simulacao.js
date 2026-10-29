const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Simulacao = sequelize.define('Simulacao', {
  usuario_id: { type: DataTypes.INTEGER, allowNull: false },
  parametros: { type: DataTypes.JSON, allowNull: false },
  resultado:  { type: DataTypes.JSON, allowNull: false },
}, {
  tableName: 'simulacoes',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false,
});

module.exports = Simulacao;
