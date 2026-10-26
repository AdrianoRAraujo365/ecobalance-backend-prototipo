// Middleware JWT — protege rotas (Parte 2 da Aula 10 da apostila)
const jwt = require('jsonwebtoken');
const SEGREDO = process.env.JWT_SECRET || 'segredo-super-secreto-trocar-em-producao';

function autenticar(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }
  const [, token] = authHeader.split(' '); // formato: "Bearer <token>"
  try {
    const dados = jwt.verify(token, SEGREDO);
    req.usuario = dados; // disponibiliza nos controllers
    next();
  } catch (erro) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
}

function somenteAdmin(req, res, next) {
  if (req.usuario?.tipo !== 'admin') {
    return res.status(403).json({ erro: 'Acesso restrito a administradores' });
  }
  next();
}

module.exports = { autenticar, somenteAdmin };
