const sequelize = require('../config/sequelize');
const Usuario = require('./Usuario');
const CoeficienteTecnico = require('./CoeficienteTecnico');
const DemandaFinal = require('./DemandaFinal');
const IndicadorESG = require('./IndicadorESG');
const LogBlockchain = require('./LogBlockchain');
const Simulacao = require('./Simulacao');

// Relacionamentos
Simulacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });
Usuario.hasMany(Simulacao, { foreignKey: 'usuario_id' });

module.exports = {
  sequelize,
  Usuario,
  CoeficienteTecnico,
  DemandaFinal,
  IndicadorESG,
  LogBlockchain,
  Simulacao,
};
