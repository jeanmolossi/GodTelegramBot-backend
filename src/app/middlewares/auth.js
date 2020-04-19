import jwt from 'jsonwebtoken';
import { promisify } from 'util';

export default async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res
      .status(401)
      .json({ error: 'Token de autenticação não fornecido ou inválido' });
  }

  const [, token] = authHeader.split(' ');

  try {
    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_MD5);
    req.userId = decoded.id;
    req.tgId = decoded.tgId;

    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid Token' });
  }
};
