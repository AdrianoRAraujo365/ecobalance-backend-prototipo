const { DataTypes } = require('sequelize');
const sequelize = require('../config/sequelize');

const Usuario = sequelize.define('Usuario', {
  nome:  { type: DataTypes.STRING(120), allowNull: false },
  email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
  senha: { type: DataTypes.STRING(255), allowNull: false },
  tipo:  { type: DataTypes.ENUM('admin', 'gestor', 'auditor', 'aluno'), defaultValue: 'gestor' },
}, {
  tableName: 'usuarios',
  timestamps: true,
  createdAt: 'criado_em',
  updatedAt: false,
  // NUNCA expor o hash de senha nas respostas da API (Aula 08 da apostila)
  defaultScope: { attributes: { exclude: ['senha'] } },
  scopes: { comSenha: { attributes: {} } },
});

module.exports = Usuario;
