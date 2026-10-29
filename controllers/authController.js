// Autenticação — bcrypt (hash de senha) + JWT (sessão stateless) — Aula 10 da apostila
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../models');

const SEGREDO = process.env.JWT_SECRET || 'segredo-super-secreto-trocar-em-producao';
const EXPIRA = process.env.JWT_EXPIRES || '8h';

async function cadastrar(req, res) {
  try {
    const { nome, email, senha, tipo } = req.body;
    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: 'Nome, e-mail e senha são obrigatórios' });
    }
    const senhaCriptografada = await bcrypt.hash(senha, 10);
    const usuario = await Usuario.create({ nome, email, senha: senhaCriptografada, tipo });
    // NUNCA retornar a senha (nem o hash) — senha excluída pelo defaultScope
    res.status(201).json({ id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo });
  } catch (erro) {
    res.status(400).json({ erro: 'Erro ao cadastrar usuário', detalhes: erro.message });
  }
}

async function login(req, res) {
  try {
    const { email, senha } = req.body;
    // scope 'comSenha' permite buscar o hash para comparar (senha nunca sai na resposta)
    const usuario = await Usuario.scope('comSenha').findOne({ where: { email } });
    if (!usuario) return res.status(401).json({ erro: 'E-mail ou senha inválidos' });

    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) return res.status(401).json({ erro: 'E-mail ou senha inválidos' });

    const token = jwt.sign(
      { id: usuario.id, nome: usuario.nome, tipo: usuario.tipo },
      SEGREDO,
      { expiresIn: EXPIRA }
    );
    res.json({
      token,
      usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, tipo: usuario.tipo },
    });
  } catch (erro) {
    res.status(500).json({ erro: 'Erro no login', detalhes: erro.message });
  }
}

module.exports = { cadastrar, login };
